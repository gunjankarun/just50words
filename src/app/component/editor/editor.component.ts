import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ConfigService } from '../../service/config.service';
import { MessageService } from '../../service/message.service';
import { AudioService } from '../../service/audio.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  config = this._configService.config;
  config_subscription: any;

  @Input() height = 200;
  @Output() keyup: EventEmitter<any> = new EventEmitter();
  @Input() target_words = this.config.target_words;
  @Input() content = '';
  @Input() word_count = 0;
  @Output() contentChange: EventEmitter<any> = new EventEmitter();
  @Output() nuked: EventEmitter<any> = new EventEmitter();

  editor_object: any;
  write_or_nuke_class = '';
  write_or_nuke_interval = this.config.write_or_nuke_interval;
  write_or_nuke_timer: any;
  @Output() editor_object_created: EventEmitter<any> = new EventEmitter();

  editorMaxWidth = this.config.editor_max_width;
  editor_text_color = this.config.editor_text_color;

  constructor(private _configService: ConfigService,
              private _elRef: ElementRef,
              private _audioService: AudioService,
              private _msgService: MessageService) {
    this.config_subscription = _configService.configChange.subscribe(
      new_config => {
        this.config = new_config;
        this.target_words = new_config.target_words;
        this.editorMaxWidth = new_config.editor_max_width;
        this.editor_text_color = new_config.editor_text_color;
        this.config.play_keypress_sound = new_config.play_keypress_sound;
        this.config.keypress_sound = new_config.keypress_sound;

        // this.write_or_nuke = new_config.write_or_nuke;
        this.write_or_nuke_interval = new_config.write_or_nuke_interval;
      }
    );
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.config_subscription.unsubscribe();
  }

  ngOnInit() {
    this.editor_object = this._elRef.nativeElement.querySelector('#editor');
    this.editor_object_created.emit(this.editor_object);
  }

  change_content(event) {
    this.contentChange.emit(event);
    this.write_or_nuke_reset();
  }

  on_tab_press(event): void {
    // console.log(event.keyCode + ' ', event.key);
    event.preventDefault();
    const s = this.editor_object.selectionStart;
    this.content =
      this.content.substring(0, this.editor_object.selectionStart) +
      '    ' +
      this.content.substring(this.editor_object.selectionEnd);
    this.editor_object.focus();

    let pos_timer: any;
    if (pos_timer) {
      clearInterval(pos_timer);
    }

    pos_timer = setTimeout(() => {
      this.editor_object.focus();
      const cursor_pos = s + 4;
      this.editor_object.setSelectionRange(cursor_pos, cursor_pos);
    }, 10);

  }

  on_keyup(event): void {
    // console.log('in KEYUP function', this.content);
    this.keyup.emit([event]);

    // Play the sound
    const play_keypress_sound = this.config.play_keypress_sound;
    const keypress_sound = this.config.keypress_sound;
    if (play_keypress_sound) {
      this._audioService.playSound(keypress_sound, 0.1);
    }

    // format text
    switch (event.key) {
      case 'Enter':
        if (!event.shiftKey) {
          // format text only when the user has not pressed the shift and enter
          this.format_text();
        }
        break;
      default:
        this.check_autocomplete(event);
        // this.check_word_replacement();
        break;
    }

    this.write_or_nuke_reset();
    if (this.config.write_or_nuke) {
      this.write_or_nuke();
    }
  }

  format_text() {
    const start_pos = this.editor_object.selectionStart;
    const end_pos = this.editor_object.selectionEnd;

    const lines = this.content.substr(0, start_pos).split('\n');
    const last_line = lines.length ? lines[lines.length - 2] : '';
    const index_space = last_line.search(/\S|$/);

    let spaces = '';
    if (index_space) {
      for (let i = 0; i < index_space; i++) {
        spaces = spaces + ' ';
      }
    }

    // get bullet chars
    // const first_two_chars: string = last_line.substr(index_space, 2);
    const find_special_chars = last_line.match(/(^[\W]+)(.+$)/i);
    if (find_special_chars) {
      const special_chars = find_special_chars[1];
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
    let number_bullet_found = false;
    let new_number = 0;
    let first_char = '';
    let spaces_before_number = 0;
    const numbers_found = last_line.match(/(^[\s\d]+)(.+$)/i);
    if (numbers_found) {
      const number_found = numbers_found[1];
      spaces_before_number = number_found.split(' ').length - 1;
      if (number_found.trim().length > 0) {
        const number_separator: string = last_line.substr(number_found.length, 2);
        const arr_number_separator = number_separator.split('');
        if (arr_number_separator && arr_number_separator.length === 2) {
          if (arr_number_separator[1] === ' ') {
            first_char = arr_number_separator[0];
            const is_special_char = first_char.match(/\W/i);
            if (is_special_char) {
              number_bullet_found = true;
              new_number = +number_found + 1;
              spaces = spaces + new_number + arr_number_separator.join('');
              // this.format_number_bullet(start_pos, end_pos, new_number, first_char, spaces_before_number);
            }
          }
        }
      }
    }

    // Update the text with bullets or indents
    if (spaces) {
      // This preserves the undo redo queue
      document.execCommand('insertText', false, spaces);
      const cursor_pos = start_pos + spaces.length;
      if (number_bullet_found) {
        this.format_number_bullet(cursor_pos, cursor_pos, new_number, first_char, spaces_before_number);
      }
    }
  }

  format_number_bullet(start, end, number, number_separator, spaces_before_number) {
    let old_start_pos = start + 1;
    const before_lines = this.content.substr(0, old_start_pos);

    const after_lines = this.content.substr(old_start_pos, this.content.length).split('\n');

    let blank_spaces = '';
    if (spaces_before_number) {
      for (let x = 0; x < spaces_before_number; x++) {
        blank_spaces = blank_spaces + ' ';
      }
    }

    for (let i = 0; i < after_lines.length; i++) {
      const numbers_found = after_lines[i].match(/(^[\s\d]+)(.+$)/i);
      if (numbers_found) {
        const number_found = numbers_found[1];
        const _number_separator: string = after_lines[i].substr(number_found.length, 2);
        const space_count = number_found.split(' ').length - 1;
        const arr_number_separator = _number_separator.split('');
        if (arr_number_separator && arr_number_separator.length === 2) {
          if (arr_number_separator[1] === ' ') {
            if (spaces_before_number === space_count) {
              const old_number = number;
              number = number + 1;
              this.editor_object.setSelectionRange(old_start_pos, old_start_pos + number_found.length);
              document.execCommand('delete');

              this.editor_object.setSelectionRange(old_start_pos, old_start_pos);
              document.execCommand('insertText', false, blank_spaces + number);

              // because insertText changed the selection start so getting new cursor location
              const new_start_pos = this.editor_object.selectionStart;

              // Adding 1 because split removes the \n character
              old_start_pos = new_start_pos + numbers_found[2].length + 1 ;

            }else {
              // stop searching immediately as soon as the numbers are not found.
              break;
            }
          }
        }
      } else {
        // stop searching immediately as soon as the numbers are not found.
        break;
      }
    }

    // Let's set the cursor back to the position where the user hit enter
    this.editor_object.setSelectionRange(start, start);
  }

  check_autocomplete(event) {
    const start_pos = this.editor_object.selectionStart;
    const end_pos = this.editor_object.selectionEnd;
    let next_few_chars = '';
    switch (event.key) {
      case '[':
        next_few_chars = ']';
        break;

      case '(':
        next_few_chars = ')';
        break;

      case '<':
        next_few_chars = '>';
        break;

      case '{':
        next_few_chars = '}';
        break;

      default:
        break;
    }

    if (next_few_chars) {
      // This preserves the undo redo queue
      document.execCommand('insertText', false, next_few_chars);
      this.editor_object.setSelectionRange(start_pos, end_pos);
    }
  }

  check_word_replacement() {
    // load this from a file
    const start_pos = this.editor_object.selectionStart;

    const content = this.content;
    const before_lines = this.content.substr(0, start_pos);

    let matches: any;
    let old_text = '';
    let new_text = '';
    const cursor_pos = start_pos;
    matches = before_lines.match(/[^\s]+/g);
    // matches = before_lines.split(' ');
    console.log('matches=', matches);
    let last_word = '';
    if (matches && matches.length) {
      last_word = matches[matches.length - 1];
      console.log('Last word is ', last_word);

      switch (last_word) {
        case '---':
          old_text = '---';
          new_text = '────────────\n';
          break;

        default:
          break;
      }
    }

    if (new_text) {
      // This preserves the undo redo queue

      this.editor_object.setSelectionRange(start_pos - old_text.length, start_pos);
      document.execCommand('delete');

      document.execCommand('insertText', false, new_text);
      const new_cursor_pos = start_pos - old_text.length + new_text.length;
      this.editor_object.setSelectionRange(new_cursor_pos, new_cursor_pos);
    }

  }

  write_or_nuke() {
    if (!this.config.write_or_nuke) {
      this.write_or_nuke_reset();
      this._msgService.add('Write or Nuke disabled', 'warning');
      return;
    }
    // Do not start the timer if word count is more than target words.
    if (this.word_count >= this.target_words) {
      this.write_or_nuke_reset();
      return;
    }

    // Do not start the timer if there is no content.
    if (this.word_count <= 0) {
      this.write_or_nuke_reset();
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
        this.config.write_or_nuke_interval / 2
      ) {

        const remaining_words = this.target_words - this.word_count;
        let msg =
          'Nuking the contents in ' + this.write_or_nuke_interval + ' seconds.';
        msg =
          msg + ' Type ' + remaining_words + ' more words to disable nuking.';
        this._msgService.add(msg, 'warning');
        // play warning sound
        this._audioService.playSound(this.config.write_or_nuke_warning_sound);
      }
      if (this.write_or_nuke_interval <= 0) {
        this._msgService.add('Content NUKED!!!', 'danger');
        this._audioService.playSound(this.config.write_or_nuke_nuked_sound);

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
    this.write_or_nuke_interval = this.config.write_or_nuke_interval;
    this.write_or_nuke_class = '';
  }


}
