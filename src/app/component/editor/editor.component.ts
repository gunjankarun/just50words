import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() editorHeight = 200;
  @Output() keyup: EventEmitter<any> = new EventEmitter();
  @Input() target_words = 0;
  @Input() content = '';
  @Input() word_count = 0;
  @Output() contentChange: EventEmitter<any> = new EventEmitter();
  @Output() nuked: EventEmitter<any> = new EventEmitter();
  editor_object: any;
  write_or_nuke_class = '';
  write_or_nuke_interval = this._configService.write_or_nuke_interval;
  write_or_nuke_timer: any;
  @Output() editor_object_created: EventEmitter<any> = new EventEmitter();

  constructor(
    private _configService: ConfigService,
    private _elRef: ElementRef,
    private _msgService: MessageService
  ) {}

  ngOnInit() {
    this.editor_object = this._elRef.nativeElement.querySelector('#editor');
    // console.log('ngOnInit ', this.editor_object.value);
    this.editor_object_created.emit(this.editor_object);
  }

  change_content(event) {
    this.contentChange.emit(event);
  }

  on_keyup(event): void {
    // console.log('content', this.content);
    this.keyup.emit([event]);

    // Play the sound
    if (this._configService.play_keypress_sound) {
      const audio = new Audio(this._configService.keypress_sound);
      audio.volume = 0.1;
      audio.play();
    }

    // format text
    switch (event.key) {
      case 'Enter':
        // format text
        this.format_text();
        break;
      default:
        break;
    }

    this.write_or_nuke_reset();
    if (this._configService.write_or_nuke) {
      this.write_or_nuke();
    }
  }

  format_text() {
    const start_pos = this.editor_object.selectionStart;
    const end_pos = this.editor_object.selectionEnd;
    // console.log ('selection start = ' + start_pos + ' and sel end = ' + end_pos);
    const content_till_cursor = this.content.substr(0, start_pos);
    // console.log('content_till_cursor', content_till_cursor);
    const lines = content_till_cursor.split('\n');
    const last_line = lines.length ? lines[lines.length - 2] : '';
    const index_space = last_line.search(/\S|$/);
    // console.log('index space', index_space);
    let spaces = '';
    if (index_space) {
      for (let i = 0; i < index_space; i++) {
        spaces = spaces + ' ';
      }
    }

    // get bullet chars
    // const first_two_chars: string = last_line.substr(index_space, 2);
    const find_special_chars = last_line.match(/(^[\W]+)(.+$)/i);
    // console.log('Special chars found', find_special_chars);

    if (find_special_chars) {
      const special_chars = find_special_chars[1];
      // const special_chars_separator: string = last_line.substr(0, special_chars.length);
      // console.log('special_chars', special_chars);
      const arr_special_chars_separator = special_chars.split('');
      if (
        arr_special_chars_separator &&
        arr_special_chars_separator.length >= 2
      ) {
        if (
          arr_special_chars_separator[
            arr_special_chars_separator.length - 1
          ] === ' '
        ) {
          spaces = arr_special_chars_separator.join('');
        }
      }
    }

    // Now create numbered list
    const numbers_found = last_line.match(/(^[\s\d]+)(.+$)/i);
    // console.log('Numbers found', numbers_found);
    if (numbers_found) {
      const number_found = numbers_found[1];
      const number_separator: string = last_line.substr(number_found.length, 2);
      const arr_number_separator = number_separator.split('');
      if (arr_number_separator && arr_number_separator.length === 2) {
        if (arr_number_separator[1] === ' ') {
          const first_char = arr_number_separator[0];
          if (first_char === '.') {
            const new_number = +number_found + 1;
            spaces = spaces + new_number + arr_number_separator.join('');
            // todo: now need to parse all future lines and if number found in future lines, then we update those numbers as well
          }
        }
      }
    }

    // Update the text with bullets or indents
    if (spaces) {
      this.content =
        content_till_cursor +
        spaces +
        this.content.substr(end_pos, this.content.length);
      // console.log('About to set selection start = ' + start_pos + ' and sel end = ' + end_pos);
      let pos_timer: any;
      if (pos_timer) {
        clearInterval(pos_timer);
      }
      pos_timer = setTimeout(() => {
        const cursor_pos = start_pos + spaces.length;
        this.editor_object.focus();
        this.editor_object.setSelectionRange(cursor_pos, cursor_pos);
      }, 10);
    }
  }


  write_or_nuke() {
    if (!this._configService.write_or_nuke) {
      this.write_or_nuke_reset();
      this._msgService.add('Write or Nuke disabled', 'warning');
      return;
    }
    // Do not start the timer if word count is more than target words.
    if (this.word_count >= this.target_words) {
      this.write_or_nuke_reset();
      return;
    }
    // console.log('word_count is ', this.word_count);
    // Do not start the timer if there is no content.
    if (this.word_count <= 0) {
      return;
    }
    if (this.write_or_nuke_timer) {
      clearInterval(this.write_or_nuke_timer);
    }
    this.write_or_nuke_timer = setTimeout(() => {
      if (!this.write_or_nuke) {

      }
      this.write_or_nuke_interval--;
      const shadow_spread = -1 * this.write_or_nuke_interval + 5;
      this.write_or_nuke_class =
        'inset 0px 0px 40px ' + shadow_spread + 'px red';

      // Show the countdown timer only after half the timer is over.
      if (
        this.write_or_nuke_interval <=
        this._configService.write_or_nuke_interval / 2
      ) {
        const remaining_words = this.target_words - this.word_count;
        let msg =
          'Nuking the contents in ' + this.write_or_nuke_interval + ' seconds.';
        msg =
          msg + ' Type ' + remaining_words + ' more words to disable nuking.';
        this._msgService.add(msg, 'warning');
      }
      if (this.write_or_nuke_interval <= 0) {
        console.log('Time over');
        this._msgService.add('Content NUKED!!!', 'danger');

        const audio = new Audio(this._configService.write_or_nuke_nuked_sound);
        audio.play();

        this.nuked.emit();
        clearInterval(this.write_or_nuke_timer);
      } else {
        this.write_or_nuke();
      }
    }, 1000);
  }

  write_or_nuke_reset() {
    if (this.write_or_nuke_timer) {
      clearInterval(this.write_or_nuke_timer);
    }
    this.write_or_nuke_interval = this._configService.write_or_nuke_interval;
    this.write_or_nuke_class = '';
  }
}
