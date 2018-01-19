import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { ConfigService } from '../../service/config.service';
import { WordCountService } from '../../service/word-count.service';

import { Article } from '../../article';
import { MessageService } from '../../service/message.service';
import { Constants } from '../../constants';

@Component({
  selector: 'app-word-count',
  templateUrl: './word-count.component.html',
  styleUrls: ['./word-count.component.css']
})
export class WordCountComponent implements OnInit {
  @Input() article_title: string;
  @Input() article_content: string;
  @Input() article: Article;

  target_words = this._configService.target_words;

  old_word_count = 0;
  celebration_timeout: any;

  // @Input() target_words = 50;
  // @Input() current_words = 50;

  label = 'Words left';
  word_count = 0;
  class = 'btn-outline-dark';

  constructor(
    private _configService: ConfigService,
    private _wordCountService: WordCountService,
    private _msgService: MessageService
  ) {
    this.word_count = this._wordCountService.word_count;
  }

  toggle_mode() {
    console.log('Mode Toggled');
    switch (this._configService.target_words_countdown_type) {
      case Constants.WORD_COUNT_TYPE.TO_TARGET:
        this._configService.target_words_countdown_type =
          Constants.WORD_COUNT_TYPE.COUNT_DOWN;
        this._msgService.add('Word count mode changed to "Countdown"');
        break;
      case Constants.WORD_COUNT_TYPE.COUNT_DOWN:
        this._configService.target_words_countdown_type =
          Constants.WORD_COUNT_TYPE.WORD_COUNT;
        this._msgService.add('Word count mode changed to "Word count"');
        break;
      case Constants.WORD_COUNT_TYPE.WORD_COUNT:
        this._configService.target_words_countdown_type =
          Constants.WORD_COUNT_TYPE.TO_TARGET;
        this._msgService.add(
          'Word count mode changed to "Countdown to target"'
        );
        break;

      default:
        break;
    }
    this.process_countdown();
  }

  ngOnInit() {
    this.word_count = this.target_words;
    switch (this._configService.target_words_countdown_type) {
      case Constants.WORD_COUNT_TYPE.TO_TARGET:
        this.label = 'Words left';
        break;
      case Constants.WORD_COUNT_TYPE.COUNT_DOWN:
        this.label = 'To type';
        this.word_count = this.target_words;
        break;
      case Constants.WORD_COUNT_TYPE.WORD_COUNT:
        this.label = 'Words typed';
        this.word_count = 0;
        break;

      default:
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const articleChange: SimpleChange = changes.article;
    if (articleChange) {
      const article = articleChange.currentValue;
      // const old_text = this.article.title + ' ' + this.article.content;

      let old_text = '';
      if (this.article) {
        old_text = this.article.content;
      }
      this.old_word_count = this._wordCountService.get_word_count(old_text);
      this.word_count = this.target_words;
      return false;
    }

    const article_title_change: SimpleChange = changes.article_title;
    if (article_title_change) {
      this.article_title = article_title_change.currentValue;
    }

    const article_content_change: SimpleChange = changes.article_content;
    if (article_content_change) {
      // console.log ('Content changed');
      this.article_content = article_content_change.currentValue;
    }

    this.process_countdown();
  }

  process_countdown() {
    const text = this.article_content;
    let celebrate = false;
    // let target = this.target_words;
    const total_word_count = this._wordCountService.get_word_count(text);
    let word_count = total_word_count;
    // adjust for existing contents
    if (this.old_word_count) {
      word_count = word_count - this.old_word_count;
    }
    this._wordCountService.word_count = word_count;

    const half_way = this.target_words / 2;
    const half_way_end = half_way + 5;
    let full_way_end = this.target_words + 5;

    // console.log('Processing ', word_count);
    switch (this._configService.target_words_countdown_type) {
      case Constants.WORD_COUNT_TYPE.TO_TARGET:
        if (word_count < this.target_words) {
          this.label = 'Words left';
        } else {
          this.label = 'Words typed';
        }

        if (word_count === this.target_words) {
          celebrate = true;
        }
        break;

      case Constants.WORD_COUNT_TYPE.COUNT_DOWN:
        this.label = 'To type';
        word_count = word_count % this.target_words;
        if (word_count === 0 && total_word_count > 0) {
          celebrate = true;
        }

        if (total_word_count > 0) {
          full_way_end = 5;
        }
        break;

      case Constants.WORD_COUNT_TYPE.WORD_COUNT:
        this.label = 'Words typed';
        if (word_count === this.target_words) {
          celebrate = true;
        }
        break;

      default:
        break;
    }

    // console.log ('word_count=' + word_count);

    if (word_count < this.target_words) {
      if (
        this._configService.target_words_countdown_type !==
        Constants.WORD_COUNT_TYPE.WORD_COUNT
      ) {
        this.word_count = this.target_words - word_count;
      } else {
        this.word_count = word_count;
      }

      if (word_count < half_way) {
        this.class = 'btn-danger';
      } else {
        this.class = 'btn-warning';
        if (word_count >= half_way && word_count <= half_way_end) {
          this._msgService.add(
            'You are halfway there. Keep on writing.',
            'warning'
          );
        }
      }
    } else {
      this.word_count = word_count;
      this.class = 'btn-outline-dark';
    }

    // Lets celebrate by playing sound
    if (celebrate) {
      if (this._configService.play_target_reached_sound) {
        const audio = new Audio(this._configService.target_reached_sound);
        audio.play();
      }
      this._wordCountService.celebrate = true;
      this._msgService.add('You did it! Proud of you.', 'success');

      // Let's show celebration banner for 5 seconds
      if (this.celebration_timeout) {
        clearInterval(this.celebration_timeout);
      }
      this.celebration_timeout = setTimeout(() => {
        this._wordCountService.celebrate = false;
      }, this._configService.session_celebration_duration * 1000);
    }
  }
}
