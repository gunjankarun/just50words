import { Injectable } from '@angular/core';
import { Article } from '../article';
import { MessageService } from './message.service';
import { FileService } from './file.service';
import { ConfigService } from './config.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ArticleService {
  config_subscription: any;

  articles: Article[];
  // filtered_articles: Article[];
  current_article: Article;
  autosave_interval: number;
  autosave_timeout: any;
  target_words: number;

  constructor(
    private _msgService: MessageService,
    private _fileService: FileService,
    private _configService: ConfigService
  ) {
    // this.load_articles();
    this.autosave_interval =
      this._configService.getConfig('auto_save_after') * 1000;
    this.target_words = this._configService.getConfig('target_words');
    this.config_subscription = _configService.configChange.subscribe(
      new_config => {
        this.autosave_interval = new_config.auto_save_after;
        this.target_words = new_config.target_words;
      }
    );
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.config_subscription.unsubscribe();
  }

  load_articles(next) {
    const scope = this;
    // scope.articles = ;
    scope._fileService.load_articles(function(err, articles) {
      if (err) {
        console.log('Error in loading articles', err);
      }
      console.log('Articles received', articles.length);
      // if (articles) {
      scope.articles = articles;
      if (scope.articles.length) {
        scope.sort_article_list();
        const article_count = scope.articles.length;
        // scope.filtered_articles = scope.articles;
        scope._msgService.add('Loaded ' + article_count + ' articles');
      }
      next();
        // }
      // }
    });
  }

  get_articles() {
    console.log('Loading articles in services');
    return this.articles;
  }

  get_blank_article() {
    const d = new Date();
    return {
      title: '',
      summary: '',
      content: '',
      content_file: '',
      date_added: d,
      date_updated: d
    };
  }

  save_article() {
    if (!this.current_article) {
      // this.new_article();
      // do nothing
    } else {
      const d = new Date();
      this.current_article.date_updated = d;
      this.sort_article_list();
      this.auto_save_start();
    }
  }

  delete_article(next) {
    const index: number = this.articles.indexOf(this.current_article);
    console.log('Deleting item at index: ' + index);
    if (index !== -1) {
      this.articles.splice(index, 1);
      this.save_article();
    }
    next(null, this.articles);
  }

  auto_save_start() {
    // this.msgService.add('Will save automatically when you stop typing.');

    if (this.autosave_timeout) {
      clearTimeout(this.autosave_timeout);
    }

    this.autosave_timeout = setTimeout(() => {
      // this._msgService.add('Starting auto save');

      this._fileService.save_article(this.current_article, true);
      this._fileService.save_articles(this.articles, true);
    }, this.autosave_interval);
  }

  auto_save_stop() {
    this._msgService.add('Autosave stopped');
    if (this.autosave_timeout) {
      clearTimeout(this.autosave_timeout);
    }
  }

  sort_article_list() {
    // console.log('About to sort articles');
    if (!this.articles) {
      // console.log('But articles are null so quitting sorting');
      return false;
    }
    this.articles.sort(function(a, b) {
      const d1 = new Date(a.date_updated);
      const d2 = new Date(b.date_updated);
      // console.log('Comparing dates ', d1);
      // console.log('with ', d2);
      return d1 > d2 ? -1 : d1 < d2 ? 1 : 0;
    });
  }

  update_summary() {
    if (this.current_article && this.current_article.content) {
      const inputWords = this.current_article.content.split(/\s+/);
      if (
        inputWords.length > this._configService.getConfig('words_in_summary')
      ) {
        this.current_article.summary =
          inputWords
            .slice(0, this._configService.getConfig('words_in_summary'))
            .join(' ') + '\u2026';
      } else {
        this.current_article.summary = this.current_article.content;
      }
    }else {
      this.current_article.summary = '';
    }
  }
}
