import { Injectable } from '@angular/core';
import { Article } from '../article';
import { MessageService } from './message.service';
import { FileService } from './file.service';
import { ConfigService } from './config.service';

@Injectable()
export class ArticleService {

  articles: Article[];
  filtered_articles: Article[];
  current_article: Article;
  autosave_interval: number;
  autosave_timeout: any;
  target_words: number;



  constructor(private msgService: MessageService,
    private fileService: FileService,
    private configService: ConfigService) {

    this.load_articles();
    this.autosave_interval = this.configService.auto_save_after * 1000;
    this.target_words = this.configService.target_words;
   }

  private load_articles() {
    let all_articles: Article[];
    const d1 = new Date('2018-01-08T09:30:51.01');
    const d2 = new Date('2018-01-07T09:30:51.01');
    const d3 = new Date('2017-08-07T19:30:51.01');
    all_articles = [
      {
        title: 'This is my first article',
        summary: 'One One One Four Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ducimus adipisci ipsum illum numquam aliquam...',
        content: 'Lorem iOne One One Four Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi voluptatem quisquam impedit alias praesentium reprehenderit officiis quis error odio voluptas nam ab pariatur id assumenda cum quos, harum, sed quas!',
        content_file: null,
        date_added: d1,
        date_updated: d1
      },
      {
        title: 'This is my second article',
        summary: 'Facere officia One Two Three Four earum repellat laboriosam amet iste quod explicabo distinctio! Totam minus at culpa illo...',
        content: 'Lorem ipsum One Two Three Four earum dolor sit amet consectetur adipisicing elit. Commodi voluptatem quisquam impedit alias praesentium reprehenderit officiis quis error odio voluptas nam ab pariatur id assumenda cum quos, harum, sed quas!',
        content_file: null,
        date_added: d2,
        date_updated: d2
      },
      {
        title: 'This is my third article',
        summary: 'Officia earum repellat laboriosam amet iste quod explicabo distinctio! Totam minus at culpa illo...',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi voluptatem quisquam impedit alias praesentium reprehenderit officiis quis error odio voluptas nam ab pariatur id assumenda cum quos, harum, sed quas!',
        content_file: null,
        date_added: d3,
        date_updated: d3
      },
      {
        title: 'This is my fourth article',
        summary: 'Dolor sit amet consectetur adipisicing elit. Voluptatibus ducimus adipisci ipsum illum numam illium elit sit...',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi voluptatem quisquam impedit alias praesentium reprehenderit officiis quis error odio voluptas nam ab pariatur id assumenda cum quos, harum, sed quas!',
        content_file: null,
        date_added: d1,
        date_updated: d1
      },
    ];

    this.articles = all_articles;
    this.sort_article_list();
    this.msgService.add('Loaded ' + this.articles.length + ' articles');
    console.log('Loaded articles ', this.articles.length);
  }

  get_articles() {
    console.log('Loading articles in services');
    return this.articles;
  }

  get_blank_article() {
    const d = new Date();
    return {
      title: null,
      summary: null,
      content: null,
      content_file: null,
      date_added: d,
      date_updated: d
    };
  }

  save_article() {
    if (!this.current_article) {
      // this.new_article();
      // do nothing
    } else {
      this.auto_save_start();
    }
  }

  auto_save_start() {
    // this.msgService.add('Will save automatically when you stop typing.');

    if (this.autosave_timeout) {
      clearTimeout(this.autosave_timeout);
    }

    this.autosave_timeout = setTimeout(() => {
      this.msgService.add('Starting auto save');

      this.fileService.save_article(this.current_article, true);
      this.sort_article_list();

    }, this.autosave_interval);
  }

  auto_save_stop() {
    this.msgService.add('Autosave stopped');
    if (this.autosave_timeout) {
      clearTimeout(this.autosave_timeout);
    }
  }

  filter_articles(filter_str: string) {
    // this.filtered_articles = this.articles;
    // console.log('Searching for ' + filter_str + ' and filtered articles are ' + this.filtered_articles.length);
    filter_str = filter_str.toLowerCase();
    this.filtered_articles = this.articles.filter(function (item) {
      let found = false;
      found = item.title.toLowerCase().indexOf(filter_str) !== -1;
      if (!found) {
        found = item.content.toLowerCase().indexOf(filter_str) !== -1;
      }
      return found;
    });
  }

  sort_article_list() {
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
      let inputWords = this.current_article.content.split(/\s+/);
      if (inputWords.length > this.configService.words_in_summary) {
        this.current_article.summary = inputWords.slice(0, this.configService.words_in_summary).join(' ') + '\u2026';
      } else {
        this.current_article.summary = this.current_article.content;
      }
    }
  }

}
