import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ConfigService } from '../../service/config.service';
import { WordCountService } from '../../service/word-count.service';

import { Article } from '../../article';
import { MessageService } from '../../service/message.service';
import { Constants } from '../../constants';
import { AudioService } from '../../service/audio.service';
/**
 * This component handles tasks related to counting words, targets etc and displaying it on screen
 * This component uses the WordCountService
 * @export
 * @class WordCountComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-word-count',
  templateUrl: './word-count.component.html',
  styleUrls: ['./word-count.component.css']
})

export class WordCountComponent implements OnInit {
  @Input() article_title: string;
  @Input() article_content: string;
  @Input() article: Article;
  config: any;
  config_subscription: any;
  target_words = 0;

  old_word_count = 0;
  celebration_timeout: any;
  celebration_music_played = false;
  tooltip_text = 'Toggle word count mode';

  label = 'Words left';
  word_count = 0;
  class = 'btn-outline-dark';

  constructor(
    private _configService: ConfigService,
    private _wordCountService: WordCountService,
    private _msgService: MessageService,
    private _audioService: AudioService
  ) {
    this.word_count = this._wordCountService.word_count;
    this.config = this._configService.config;
    this.target_words = this.config.target_words;

    this.config_subscription = _configService.configChange.subscribe(
      new_config => {
        this.config = new_config;
        console.log(
          'Detected the change in word-count.component with word count',
          new_config.target_words
        );
        this.target_words = new_config.target_words;
        console.log('new target_words =', this.target_words);

        this.word_count = this.target_words;
        this.config.target_reached_sound = new_config.target_reached_sound;

        switch (this.config.target_words_countdown_type) {
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
    );
  }

  toggle_mode() {
    console.log('Mode Toggled');
    switch (this._configService.getConfig('target_words_countdown_type')) {
      case Constants.WORD_COUNT_TYPE.TO_TARGET:
        this._configService.setConfig(
          'target_words_countdown_type',
          Constants.WORD_COUNT_TYPE.COUNT_DOWN
        );
        this._msgService.add('Word count mode changed to "Countdown"');
        break;
      case Constants.WORD_COUNT_TYPE.COUNT_DOWN:
        this._configService.setConfig(
          'target_words_countdown_type',
          Constants.WORD_COUNT_TYPE.WORD_COUNT
        );
        this._msgService.add('Word count mode changed to "Word count"');
        break;
      case Constants.WORD_COUNT_TYPE.WORD_COUNT:
        this._configService.setConfig(
          'target_words_countdown_type',
          Constants.WORD_COUNT_TYPE.TO_TARGET
        );
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
    // Do nothing.
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.config_subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    const articleChange: SimpleChange = changes.article;
    if (articleChange) {
      const article = articleChange.currentValue;

      let old_text = '';
      if (this.article && this.article.content) {
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
      this.article_content = article_content_change.currentValue;
    }

    this.process_countdown();
  }

  process_countdown() {
    const text = this.article_content;
    let celebrate = false;
    const total_word_count = this._wordCountService.get_word_count(text);
    let word_count = total_word_count;
    // adjust for existing contents
    if (this.old_word_count) {
      // if the user deleted something from old content then ignore the negative number
      if (this.old_word_count > word_count) {
        this.old_word_count = word_count;
      }

      word_count = word_count - this.old_word_count;
    }


    this._wordCountService.word_count = word_count;

    const half_way = this.target_words / 2;
    const half_way_end = half_way + 5;
    let full_way_end = this.target_words + 5;

    switch (this._configService.getConfig('target_words_countdown_type')) {
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

    if (word_count < this.target_words) {
      if (
        this._configService.getConfig('target_words_countdown_type') !==
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
      if (this.config.target_reached_sound) {
        if (!this.celebration_music_played) {
          this._audioService.playSound(this.config.target_reached_sound);

          // This ensures that the music does not play for every key stroke of the 50th (or target wordcount) word
          this.celebration_music_played = true;
        }
      }
      this._wordCountService.celebrate = true;
      this._msgService.add('You did it! Proud of you.', 'success');

      // Let's show celebration banner for 5 seconds
      if (this.celebration_timeout) {
        clearInterval(this.celebration_timeout);
      }
      this.celebration_timeout = setTimeout(() => {
        this._wordCountService.celebrate = false;
        this.celebration_music_played = false;
      }, this.config.session_celebration_duration * 1000);
    }
  }
}
