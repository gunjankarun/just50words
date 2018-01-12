import { Injectable } from '@angular/core';
import { Article } from '../article';
import { MessageService } from './message.service';
import { FileService } from './file.service';
import { ConfigService } from './config.service';

@Injectable()
export class ArticleService {

  articles: Article[];
  // filtered_articles: Article[];
  current_article: Article;
  autosave_interval: number;
  autosave_timeout: any;
  target_words: number;



  constructor(
    private _msgService: MessageService,
    private _fileService: FileService,
    private _configService: ConfigService) {

    // this.load_articles();
    this.autosave_interval = this._configService.auto_save_after * 1000;
    this.target_words = this._configService.target_words;
    // this.current_article = this.get_blank_article();
   }

  load_articles(next) {
    const scope = this;
    scope._fileService.load_articles(function(err, articles){
      if (err) {
        console.log('Error in loading articles', err);
      }else {
        console.log('Articles received', articles.length);
        // if (articles) {
        scope.articles = articles;
        scope.sort_article_list();
        const article_count = scope.articles.length;
        // scope.filtered_articles = scope.articles;

        scope._msgService.add('Loaded ' + article_count + ' articles');
        next();
        // }
      }
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
    this.articles.sort(function (a, b) {
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
      if (inputWords.length > this._configService.words_in_summary) {
        this.current_article.summary = inputWords.slice(0, this._configService.words_in_summary).join(' ') + '\u2026';
      } else {
        this.current_article.summary = this.current_article.content;
      }
    }
  }

}
