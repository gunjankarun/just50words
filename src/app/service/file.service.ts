import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { ConfigService } from './config.service';
import { Article } from '../article';

@Injectable()
export class FileService {

  constructor(private msgService: MessageService, private configService: ConfigService) { }

  save_article(article: Article, autosave = false) {
    console.log('saving content: ', article.title);
    // let inputWords = article.title.split(/\s+/);
    let article_file: string;
    if (article.content_file) {
      article_file = article.content_file;
    }else {
      const random_number = Math.floor(Math.random() * 999999) + 100000;
      let article_title = '';
      if (article.title) {
        article_title = article.title;
      }else {
        article_title = 'article';
      }
      const article_file_name = article.title.split(/\s+/).join('-') + '-' + random_number;
      article_file = this.configService.article_folder + '/' + article_file_name;
      article.content_file = article_file;
    }
    const article_file_contents = JSON.stringify(article);

    let message = 'Contents saved successfully';
    if (autosave) {
      message = 'Contents saved automatically';
    }
    // message = message + ' in ' + article_file;
    this.msgService.add(message, 'success');
  }

  save_summary(content: string, autosave = false) {
    console.log('saving content: ', content);

    const article_summary_file = this.configService.article_summary_folder + '/_summary.json';

    let message = 'File saved ';
    if (autosave) {
      message = 'File saved automatically';
    }
    message = message + ' in ' + article_summary_file;
    this.msgService.add(message, 'success');
  }

  load() {
    this.msgService.add('File Loaded', 'success');
  }

}
