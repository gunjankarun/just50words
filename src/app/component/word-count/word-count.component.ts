import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core'; 

import { ConfigService } from '../../service/config.service';
import { WordCountService } from '../../service/word-count.service';

import { Article } from '../../article';

@Component({
  selector: 'app-word-count',
  templateUrl: './word-count.component.html',
  styleUrls: ['./word-count.component.css']
})
export class WordCountComponent implements OnInit {
  @Input() article_title: string;
  @Input() article_content: string;
  target_words = this.configService.target_words;

  // @Input() target_words = 50;
  // @Input() current_words = 50;

  label = 'Words Left';
  word_count = 0;
  class = 'btn-outline-dark';

  constructor(
    private configService: ConfigService, private wordCountService: WordCountService) { }

  ngOnInit() {
    this.word_count = this.target_words;
  }

  ngOnChanges(changes: SimpleChanges) {
    const article_title_change: SimpleChange = changes.article_title;
    if (article_title_change) {
      this.article_title  = article_title_change.currentValue;
    }

    const article_content_change: SimpleChange = changes.article_content;
    if (article_content_change) {
      // console.log ('Content changed');
      this.article_content  = article_content_change.currentValue;
    }

    const text = this.article_title + ' ' + this.article_content;
    const word_count = this.wordCountService.get_word_count(text);
    if (word_count < this.target_words) {
      this.word_count = this.target_words - word_count;
      this.label = 'Words Left';
      if (word_count < this.target_words / 2) {
        this.class = 'btn-danger';
      } else {
        this.class = 'btn-warning';
      }
    } else {
      this.word_count = word_count;
      this.label = 'Words Typed';
      this.class = 'btn-outline-dark';
    }

    // const name: SimpleChange = changes.name;
    // console.log('prev value: ', name.previousValue);
    // console.log('got name: ', name.currentValue);
    // this._name = name.currentValue.toUpperCase();
  }
}
