import { Injectable } from '@angular/core';
import { Article } from '../article';
import { ElectronService } from 'ngx-electron';

/**
 * This service handles the file operations from renderer process. This passes the commands to the application process
 * The application process performs the actual file operations and sends a response back here asynchronously
 *
 * @export
 * @class FileService
 */
@Injectable()
export class FileService {
  fs = require('fs');
  ipc = this._electronService.ipcRenderer;

  application_root = '';
  // data_folder = 'data';
  article_file_name = '_articles';
  config_file_name = '_config.json';

  article_folder = this.application_root;
  article_file = this.article_folder + this.article_file_name;
  config_file = this.article_folder + this.config_file_name;

  constructor(private _electronService: ElectronService) {
    console.log('Application folder is ', this.application_root);
    if (this._electronService.isElectronApp) {
      const remote = this._electronService.remote;
      this.application_root = remote.getGlobal('application_root');
      this.article_folder = this.application_root ;
      this.article_file = this.article_folder + '_articles';
      this.config_file = this.article_folder + '_config.json';
    }
  }

  save_article(article: Article, autosave = false) {
    let article_file: string;
    if (article.content_file) {
      article_file = article.content_file;
    } else {
      const random_number = Math.floor(Math.random() * 999999) + 100000;
      let article_title = '';
      if (article.title) {
        article_title = article.title;
      } else {
        article_title = 'article';
      }
      let article_file_name = 'article';
      if (article.title) {
        article_file_name =
          article.title.split(/\s+/).join('-') + '-' + random_number;
      }
      article_file = this.article_folder + '/' + article_file_name;
      article.content_file = article_file;
    }
    const article_file_contents =
      '# ' + article.title + '\r\n\r\n' + article.content + '\r\n';

    const save_data = {
      file_name: article_file,
      file_contents: article_file_contents,
      file_type: 'article'
    };

    // disabling of saving individual files. Uncomment this to save individual files separately
    // this.save(save_data, autosave);
  }

  save_articles(articles: Article[], autosave = false) {
    const file_contents = JSON.stringify(articles);
    const save_data = {
      file_name: this.article_file,
      file_type: 'article',
      file_contents: file_contents
    };

    this.save(save_data, autosave);
  }

  save(save_data, autosave) {
    // Now save this here

    if (this._electronService.isElectronApp) {
      this.ipc.send('save-file', save_data);

      const scope = this;
      this.ipc.on('file-saved-article', function(evt, args) {
        let message = 'Contents saved successfully';
        if (autosave) {
          message = 'Contents saved automatically';
        }
        const date = new Date();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        message = message + ' at ' + hour + ':' + minutes + ':' + seconds;
      });

      this.ipc.on('file-save-error-article', function(evt, args) {
        const err_message = 'Could not save contents';
        console.log(err_message);
      });
    } else {
      // console.log('Cannot save file, not an electron app');
    }
  }

  load_articles(next): any {
    if (this._electronService.isElectronApp) {
      const scope = this;
      let result: any;

      const load_data = {
        file_name: scope.article_file,
        file_type: 'article'
      };

      scope.ipc.send('read-file', load_data);

      scope.ipc.on('file-read-error-article', function(evt, args) {
        console.log(
          'IPC Renderer says, file NOT read so loading default articles',
          args
        );
        result = scope.get_default_article();
        console.log('Default article received is ', result);
        next(null, result);
      });

      scope.ipc.on('file-read-article', function(evt, args) {
        try {
          result = JSON.parse(args);
          const message = 'Json Parsed successfully';
          next(null, result);
        } catch (error) {
          console.log('Loading error ', error);
          const err_message =
            'File loading error. So sending default article instead';
          console.log(err_message);
          result = scope.get_default_article();
          next(error, result);
        }
      });
    } else {
      // Some dummy data to test in browser
      const old_data = `[
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
      ]`;
      let result: any;
      try {
        result = JSON.parse(old_data);
        const message = 'OLD data Json Parsed successfully';
        next(null, result);
      } catch (error) {
        console.log('Loading error in OLD data JSON', error);
        console.log(old_data);
        const err_message = 'File loading error';
        next(error, null);
      }
    }
  }

  get_default_article(): any {
    const default_articles = `[
        {
          "title": "",
          "summary": "",
          "content": "",
          "content_file": "",
          "date_added": "",
          "date_updated": ""
        }
        ]`;
    let result: any;
    result = JSON.parse(default_articles);
    return result;
  }

  // Configuration related data
  load_config(config, next): any {
    if (this._electronService.isElectronApp) {
      const scope = this;

      const load_data = {
        file_name: scope.config_file,
        file_type: 'config'
      };

      // this._msgService.add('File Loaded', 'success');
      scope.ipc.send('read-file', load_data);

      scope.ipc.on('file-read-error-config', function(evt, args) {
        scope.create_default_files(config, function(err, msg) {
          console.log('created defaults');
        });
        // scope._msgService.add(err_message, 'danger');
      });

      scope.ipc.on('file-read-config', function(evt, args) {
        let result: any;
        try {
          result = JSON.parse(args);
          const message = 'Config Json Parsed successfully';
          console.log(message);
          next(null, result);
          return;
        } catch (error) {
          // Need to overwrite config data here.
          console.log('Config Loading error ', error);
          const err_message = 'Config file loading error';
          console.log(err_message);
          // scope._msgService.add(err_message, 'danger');
          next(error, null);
          return;
        }
      });
    } else {
      // Some dummy data to test in browser
      const old_data = `
    {
      "target_words": 250,
      "message_dismiss_after": 300,
      "mute_all_sound": false,
      "target_words_countdown_type": "to_target",
      "write_or_nuke": false
    }
      `;
      let result: any;
      try {
        result = JSON.parse(old_data);
        const message = 'OLD config data Json Parsed successfully';
        next(null, result);
        return;
      } catch (error) {
        next(error, null);
        return;
      }
    }
  }

  /**
   * This creates the default config file
   *
   * @param {*} config
   * @param {any} next
   * @memberof FileService
   */
  save_config_file(config: any, next) {
    const file_contents = JSON.stringify(config, null, 4);
    const save_data = {
      file_name: this.config_file,
      file_type: 'config',
      file_contents: file_contents
    };

    this.save(save_data, false);

    const scope = this;
    this.ipc.on('file-saved-config', function(evt, args) {
      next(null, config);
    });

    this.ipc.on('file-save-error-config', function(evt, args) {
      next(args, null);
    });
  }

  /**
   * Check if the data folder is available or not.
   * @param config
   * @param next callback function
   */
  create_default_files(config, next) {
    const scope = this;
    const load_data = {
      data_folder_name: scope.article_folder,
      article_file_name: this.article_file,
      article_file_data: '',
      config_file_name: this.config_file,
      config_file_data: JSON.stringify(config, null, 4)
    };

    if (scope._electronService.isElectronApp) {
      // run only in electron

      scope.ipc.send('create-defaults', load_data);

      scope.ipc.on('created-defaults', function(evt, args) {
        next();
      });
    } // end of if iselectron app
  }

  backup_articles(next) {
    // copy articles from data folder to documents folder
    const scope = this;
    const load_data = {
      article_file_name: this.article_file
    };

    if (scope._electronService.isElectronApp) {
      // run only in electron

      scope.ipc.send('backup-articles', load_data);

      scope.ipc.on('backup-articles-done', function(evt, args) {
        next(null, args);
      });
      scope.ipc.on('backup-articles-error', function(evt, args) {
        next(args, null);
      });
    } // end of if iselectron app
  }
}
