import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { ConfigService } from '../../service/config.service';
import { WordCountService } from '../../service/word-count.service';

import { Article } from '../../article';
import { MessageService } from '../../service/message.service';

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

  // @Input() target_words = 50;
  // @Input() current_words = 50;

  label = 'Words left';
  word_count = 0;
  class = 'btn-outline-dark';

  constructor(
    private _configService: ConfigService,
    private _wordCountService: WordCountService,
    private _msgService: MessageService
  ) { }

  ngOnInit() {
    this.word_count = this.target_words;
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

    const text = this.article_content;
    let word_count = this._wordCountService.get_word_count(text);
    const half_way = this.target_words / 2;
    const half_way_end = half_way + 10;
    const full_way_end = this.target_words + 10;
    if (this.old_word_count) {
      word_count = word_count - this.old_word_count;
    }

    if (word_count === this.target_words) {
      if (this._configService.play_target_reached_sound) {
        const audio = new Audio(this._configService.target_reached_sound);
        audio.play();
      }
    }

    if (word_count < this.target_words) {
      this.word_count = this.target_words - word_count;
      this.label = 'Words left';
      if (word_count < half_way) {
        this.class = 'btn-danger';
      } else {
        this.class = 'btn-warning';
        if (word_count >= half_way && word_count <= half_way_end) {
          this._msgService.add('You are halfway there. Keep on writing.', 'warning');
        }
      }
    } else {
      this.word_count = word_count;
      this.label = 'Words typed';
      this.class = 'btn-outline-dark';
      if (word_count <= full_way_end) {
        this._wordCountService.celebrate = true;
        this._msgService.add('You did it! Proud of you.', 'success');
      } else {
        this._wordCountService.celebrate = false;
      }
    }
  }
}
