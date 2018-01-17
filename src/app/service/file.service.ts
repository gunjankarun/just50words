import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { ConfigService } from './config.service';
import { Article } from '../article';
import { ElectronService } from 'ngx-electron';

@Injectable()
export class FileService {
  fs = require('fs');
  ipc = this._electronService.ipcRenderer;
  article_summary_file = this._configService.article_summary_folder + '/_articles';

  constructor(
    private _msgService: MessageService,
    private _configService: ConfigService,
    private _electronService: ElectronService
  ) { }

  save_article(article: Article, autosave = false) {
    // console.log('saving content: ', article.title);
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
      let article_file_name = 'article';
      if (article.title) {
        article_file_name = article.title.split(/\s+/).join('-') + '-' + random_number;
      }
      article_file = this._configService.article_folder + '/' + article_file_name;
      article.content_file = article_file;
    }
    // const article_file_contents = JSON.stringify(article);
    const article_file_contents = '# ' + article.title + '\r\n\r\n' + article.content + '\r\n';

    const save_data = {
      file_name: article_file,
      file_contents: article_file_contents
    };

    this.save(save_data, autosave);
  }
  save_articles(articles: Article[], autosave = false) {
    console.log('saving articles: ');
    const file_contents = JSON.stringify(articles);
    const save_data = {
      file_name: this.article_summary_file,
      file_contents: file_contents
    };

    this.save(save_data, autosave);
  }

  // save_summary(content: Article[], autosave = false) {
  //   // console.log('saving content: ', content);

  //   const article_summary_file = this._configService.article_summary_folder + '/_articles.json';

  //   let message = 'File saved ';
  //   if (autosave) {
  //     message = 'File saved automatically';
  //   }
  //   message = message + ' in ' + article_summary_file;
  //   this._msgService.add(message, 'success');
  // }

  save(save_data, autosave) {
    // Now save this here
    // this._msgService.add('Going to save the article now', 'primary');

    if (this._electronService.isElectronApp) {
      console.log('Electron app Sending to save');
      this.ipc.send('send-to-save', save_data);

      const scope = this;
      this.ipc.on('file-saved', function (evt, args) {
        // console.log('IPC Renderer says, file saved', args);
        let message = 'Contents saved successfully';
        if (autosave) {
          message = 'Contents saved automatically';
        }
        const date = new Date();
        // const year = date.getFullYear();
        // const month = date.getMonth() + 1;
        // const day = date.getDate();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        message = message + ' at ' + hour + ':' + minutes + ':' + seconds;
        scope._msgService.add(message, 'success');
      });


      this.ipc.on('file-save-error', function (evt, args) {
        console.log('IPC Renderer says, file NOT saved', args);
        const err_message = 'Could not save contents';
        scope._msgService.add(err_message, 'danger');
      });
    } else {
      // console.log('Cannot save file, not an electron app');
    }
  }

  load_articles(next): any {
    if (this._electronService.isElectronApp) {
    //   console.log ('Not loading articles because not Electron');
    //   return ;
    // }
      console.log('About to load articles from ' + this.article_summary_file);
      const scope = this;

      const load_data = {
        file_name: scope.article_summary_file
      };

      // this._msgService.add('File Loaded', 'success');
      scope.ipc.send('read-file', load_data);

      scope.ipc.on('file-read-error', function (evt, args) {
        console.log('IPC Renderer says, file NOT read', args);
        const err_message = 'Could not load contents';
        scope._msgService.add(err_message, 'danger');
      });

      scope.ipc.on('file-read', function (evt, args) {
        // console.log('IPC Renderer says, file read');
        let result: any;
        try {
          result = JSON.parse(args);
          const message = 'Json Parsed successfully';
          scope._msgService.add(message, 'success');
          next(null, result);
        } catch (error) {
          console.log('Loading error ', error);
          const err_message = 'File loading error';
          scope._msgService.add(err_message, 'danger');
          next(error, null);
        }
      });
    }else {
      const old_data = `
    [
  {
    "title": "This is article number two",
    "summary": "I said number 2",
    "content": "I said number 2",
    "content_file": "/Users/gunjan/Projects/just50words/articles/This-is-article-number-two-276983",
    "date_added": "2018-01-12T10:29:05.492Z",
    "date_updated": "2018-01-12T19:49:17.847Z"
  },
  {
    "title": "This is an article by GK",
    "summary": "I am working on an article by GK ",
    "content": "I am working on an article by GK ",
    "content_file": "/Users/gunjan/Projects/just50words/articles/article",
    "date_added": "2018-01-12T11:08:35.644Z",
    "date_updated": "2018-01-12T19:45:11.696Z"
  },
  {
    "title": "Another article",
    "summary": "This is another artile",
    "content": "This is another artile",
    "content_file": "/Users/gunjan/Projects/just50words/articles/another-article-550171",
    "date_added": "2018-01-12T10:44:13.021Z",
    "date_updated": "2018-01-12T10:44:33.781Z"
  },
  {
    "title": "I am another article",
    "summary": "I have been working hard",
    "content": "I have been working hard",
    "content_file": "/Users/gunjan/Projects/just50words/articles/I-am-another-article-430310",
    "date_added": "2018-01-12T10:40:48.451Z",
    "date_updated": "2018-01-12T10:41:00.994Z"
  },
  {
    "title": "This is an article",
    "summary": "Wow, this works and another article that I plan to write now.",
    "content": "Wow, this works and another article that I plan to write now.",
    "content_file": "/Users/gunjan/Projects/just50words/articles/This-is-an-article-757449",
    "date_added": "2018-01-12T10:28:43.343Z",
    "date_updated": "2018-01-12T10:40:46.490Z"
  }
]
      `;
        let result: any;
        try {
          result = JSON.parse(old_data);
          const message = 'OLD data Json Parsed successfully';
          this._msgService.add(message, 'success');
          next(null, result);
        } catch (error) {
          console.log('Loading error in OLD data JSON', error);
          const err_message = 'File loading error';
          this._msgService.add(err_message, 'danger');
          next(error, null);
        }
    }
  }
}
