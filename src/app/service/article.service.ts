import { Injectable } from '@angular/core';
import { Article } from '../article';
import { MessageService } from './message.service';
import { FileService } from './file.service';

@Injectable()
export class ArticleService {

  articles: Article[];
  current_article: Article;
  autosave_interval = 3 * 1000;
  autosave_timeout: any;


  constructor(private msgService: MessageService, private fileService: FileService) {
    this.load_articles();
   }

  private load_articles() {
    let all_articles: Article[];
    all_articles = [
      {
        title: 'This is my first article',
        summary: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ducimus adipisci ipsum illum numquam aliquam...',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi voluptatem quisquam impedit alias praesentium reprehenderit officiis quis error odio voluptas nam ab pariatur id assumenda cum quos, harum, sed quas!',
        content_file: null
      },
      {
        title: 'This is my second article',
        summary: 'Facere officia earum repellat laboriosam amet iste quod explicabo distinctio! Totam minus at culpa illo...',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi voluptatem quisquam impedit alias praesentium reprehenderit officiis quis error odio voluptas nam ab pariatur id assumenda cum quos, harum, sed quas!',
        content_file: null
      },
      // {
      //   title: 'This is my third article',
      //   summary: 'Officia earum repellat laboriosam amet iste quod explicabo distinctio! Totam minus at culpa illo...',
      //   content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi voluptatem quisquam impedit alias praesentium reprehenderit officiis quis error odio voluptas nam ab pariatur id assumenda cum quos, harum, sed quas!',
      //   content_file: null
      // },
      // {
      //   title: 'This is my fourth article',
      //   summary: 'Dolor sit amet consectetur adipisicing elit. Voluptatibus ducimus adipisci ipsum illum numam illium elit sit...',
      //   content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi voluptatem quisquam impedit alias praesentium reprehenderit officiis quis error odio voluptas nam ab pariatur id assumenda cum quos, harum, sed quas!',
      //   content_file: null
      // },
    ];

    this.articles = all_articles;
    this.msgService.add('Loaded ' + this.articles.length + ' articles');
    console.log('Loaded articles ', this.articles.length);
  }

  get_articles() {
    console.log('Loading articles in services');
    return this.articles;
  }

  get_blank_article() {
    return {
      title: null,
      summary: null,
      content: null,
      content_file: null
    };
  }

  save_article() {
    this.msgService.add('Saving Article', this.current_article.title);
  }

  auto_save_start() {
    this.msgService.add('Will save automatically when you type.');

    if (this.autosave_timeout) {
      clearTimeout(this.autosave_timeout);
    }

    this.autosave_timeout = setTimeout(() => {
      this.msgService.add('Starting auto save');
      this.fileService.save(true);
    }, this.autosave_interval);
  }

  auto_save_stop() {
    this.msgService.add('Autosave stopped');
    if (this.autosave_timeout) {
      clearTimeout(this.autosave_timeout);
    }
  }


}
