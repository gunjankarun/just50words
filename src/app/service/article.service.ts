import { Injectable } from '@angular/core';
import { Article } from '../article';
import { MessageService } from './message.service';

@Injectable()
export class ArticleService {

  articles: Article[];

  constructor(private msgService: MessageService) {
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

  save_article(article: Article) {
    console.log('Saving Article', article);
  }


}
