import { Component, OnInit, OnDestroy, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subject } from 'rxjs/Subject';
import { Article } from '../../article';
import { Constants } from '../../constants';
import { ArticleService } from '../../service/article.service';
import { ConfigService } from '../../service/config.service';
import { MessageService } from '../../service/message.service';
import { FileService } from '../../service/file.service';
import { WordCountService } from '../../service/word-count.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { WritingPromptComponent } from '../writing-prompt/writing-prompt.component';
import { ConfigComponent } from '../config/config.component';
import { WritingPromptService } from '../../service/writing-prompt.service';
import { UpdateService } from '../../service/update.service';
import { Subscription } from 'rxjs/Subscription';

/**
 * This is the main component that shows the main editor screen.
 * This uses the ArticlesService for persistent storage of articles
 * @export
 * @class ArticlesComponent
 * @implements {OnInit}
 */
@Component({
  providers: [],
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() listHeight: number;
  @Input() editorHeight: number;
  @Input() editor_object: any;

  @ViewChild('articleList') private articleListContainer: ElementRef;
  @ViewChild('configPopup') private cPopup: ElementRef;
  @ViewChild('updatePopup') private uPopup: ElementRef;

  configChange: Subject<any> = new Subject<any>();

  config = this._configService.config;
  config_subscription: Subscription;
  writingprompt_subscription: Subscription;

  app_version = this._configService.app_version;
  git_username = Constants.GIT_USERNAME;
  git_repo_name = Constants.GIT_REPO_NAME;
  update_data: any;

  config_folder = '';
  config_file = '';

  editorMaxWidth = this.config.editor_max_width;

  articles: Article[];
  filtered_articles: Article[];
  celebrate = false;
  headline_object: any;
  headline_font = 'form-control font-large';

  target_words = this.config.target_words;
  word_count = 0;
  target_time: string;
  search_term = '';
  current_article = this._articleService.get_blank_article();
  show_list = true;
  select_first_article = false;
  show_list_label = '<span class="oi oi-caret-left"> </span>';
  old_title: string;
  write_or_nuke_mode = this.config.write_or_nuke;
  write_or_nuke_show_button = this.config.write_or_nuke_show_button;
  editor_bg = this.config.editor_bg;
  editor_text_color = this.config.editor_text_color;

  constructor(
    private _articleService: ArticleService,
    private _configService: ConfigService,
    private _msgService: MessageService,
    private _elRef: ElementRef,
    private _wordCountService: WordCountService,
    private _electronService: ElectronService,
    private _modalService: NgbModal,
    private _updateService: UpdateService,
    private _writingPromptService: WritingPromptService
  ) {
      // constructor
      const scope = this;

      if (this._electronService.isElectronApp) {
        // this.app_version = this._electronService.remote.app.getVersion();
        this.config_folder = this._electronService.remote.getGlobal('application_root');
        this.config_file = this.config_folder + '_config.json';
      }

      this.config = this._configService.config;
      // Listen for configuration changes
      this.config_subscription = this._configService.cast.subscribe(
        new_config => {
          this.config = new_config;
          this.target_words = new_config.target_words;
          this.editorMaxWidth = new_config.editor_max_width;
          this.write_or_nuke_mode = new_config.write_or_nuke;
          this.write_or_nuke_show_button =
            new_config.write_or_nuke_show_button;
          this.editor_bg = new_config.editor_bg;
          this.editor_text_color = new_config.editor_text_color;
        }
      );

      this.writingprompt_subscription = _writingPromptService.promptSelected$.subscribe(
        prompt => {
          this.current_article.title = prompt;
          // this.current_article.content = '# ' + prompt + '  \n\n';
          this.update_font_class();
          this.editor_object.focus();
        }
      );

      this._articleService.load_articles(function(err, articles) {
        scope.articles = scope._articleService.articles;
        scope.reset_list();
        scope.new_article();
      });
    }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    // this.config_subscription.unsubscribe();
    this.writingprompt_subscription.unsubscribe();
  }

  show_options() {
    // will show options popup here
    this._modalService.open(this.cPopup).result.then(
      result => {
        // console.log(`Closed with: ${result}`);
      },
      reason => {
        // console.log(`Dismissed ${reason}`);
      }
    );
  }

  open_url(event, url) {
    event.preventDefault();
    if (this._electronService.isElectronApp) {
      this._electronService.shell.openExternal(url);
    } else {
      window.open(url, '_blank');
      console.log('Not an electron app. hence could not launch_window');
    }
  }

  open_folder(event, url) {
    event.preventDefault();
    if (this._electronService.isElectronApp) {
      this._electronService.shell.showItemInFolder(url);
    } else {
      console.log('Not an electron app. hence could not launch_window');
    }
  }

  open_youtube_tutorial(event) {
    this.open_url(event, Constants.YOUTUBE_TUTORIAL_URL);
  }

  ngOnInit() {
    // On init activities
  }

  ngAfterViewInit() {
    this.headline_object = this._elRef.nativeElement.querySelector('#headline');
    let is_first_run = true;
    if (this._electronService.isElectronApp) {
      is_first_run = this._electronService.remote.getGlobal('is_first_run');
      if (is_first_run) {
        this.show_options();
      } else {
        if (this.config.check_for_updates_automatically) {
          const scope = this;
          this._updateService.check_update(
            this.app_version,
            this.git_username,
            this.git_repo_name,
            function(err, update_obj) {
              if (update_obj.new_version_available) {
                scope.update_data = update_obj;
                scope._modalService.open(scope.uPopup).result.then(
                  result => {
                    // console.log(`Closed with: ${result}`);
                  },
                  reason => {
                    // console.log(`Dismissed ${reason}`);
                  }
                );
              }
            }
          );
        } // end of check_for_updates_automatically
      }
    }
  }

  create_editor_object(obj: any) {
    this.editor_object = obj;
  }

  select_article(article) {
    // make sure that the last empty item is trimmed
    this.trim_last_empty_item();
    this.current_article = article;
    this._articleService.current_article = this.current_article;
    this.reset_list();
    this._msgService.add('Loaded article "' + article.title + '"', 'info');
    this.editor_object.focus();
    // set the cursor at the start
    // this.editor_object.setSelectionRange(0, 0);
    setTimeout(() => {
      this.editor_object.setSelectionRange(0, 0);
    }, 50);

    this.update_font_class();
  }

  toggle_list() {
    this.show_list = !this.show_list;
    if (this.show_list) {
      this.show_list_label = '<span class="oi oi-caret-left"></span>';
    } else {
      this.show_list_label = '<span class="oi oi-caret-right"></span>';
    }
  }

  search_article_from_search(event) {
    this.filter_articles(this.search_term);
    this.select_first_article = true;

    switch (event.key) {
      case 'Enter':
        if (this.articles) {
          this.select_article(this.filtered_articles[0]);
          this.editor_object.focus();
        }
        break;

      default:
        break;
    }
  }

  focus_set() {
    if (this.current_article) {
      this.old_title = this.current_article.title;
    }
  }

  key_pressed_textarea(event) {
    let is_printable_char = false;
    if (event && event.key && (event.key.length === 1 || event.key === 'Enter' || event.key === 'Backspace' || event.key === 'Delete')) {
      is_printable_char = true;
    }

    // All operations happen only when the key is printable so arrow etc should not be registered as keysound event
    if (is_printable_char) {
      this.save_articles();
      this.update_summary();
      this.celebrate = this._wordCountService.celebrate;
      this.word_count = this._wordCountService.word_count;
    }
  }

  key_pressed_headline(event) {
    this.update_summary();
    this.save_articles();

    // Do not save articles if only the headline is being changed.
    switch (event.key) {
      case 'Enter':
        if (event.shiftKey) {
          // Shift key was pressed
        }
        this.editor_object.focus();
        // reset the filtered articles list
        break;

      default:
        break;
    }
  }

  new_article_button_click() {
    this.old_title = '';
    this.new_article();
    this.headline_object.focus();
  }

  new_article() {
    // make sure that the last empty item is trimmed
    this.trim_last_empty_item();

    this.current_article = this._articleService.get_blank_article();

    if (!this.articles) {
      this.articles = [];
    }
    this._articleService.current_article = this.current_article;
    this.articles.unshift(this.current_article);
    this.select_first_article = false;
    this.update_font_class();
    this.reset_list();
  }

  delete_article() {
    const title = this.current_article.title
      ? this.current_article.title
      : 'this article';
    const msg =
      'Are you sure you want to delete ' +
      title +
      '\nWARNING: This cannot be undone.';
    if (confirm(msg)) {
      const scope = this;
      this._articleService.delete_article(function(err, articles) {
        scope.articles = scope._articleService.articles;
        scope.new_article();
        scope.reset_list();
        scope._msgService.add('Deleted: ' + title, 'danger');
      });
    }
  }

  filter_articles(filter_str: string) {
    if (!this.articles) {
      return;
    }

    filter_str = filter_str.toLowerCase();
    this.filtered_articles = this.articles.filter(function(item) {
      let found = false;
      if (item.title) {
        found = item.title.toLowerCase().indexOf(filter_str) !== -1;
      }
      if (!found) {
        if (item.content) {
          found = item.content.toLowerCase().indexOf(filter_str) !== -1;
        }
      }
      return found;
    });
  }

  save_articles() {
    if (this._articleService.current_article) {
      this.filtered_articles = this.articles;
      this._articleService.articles = this.articles;
      this._articleService.current_article = this.current_article;
      this._articleService.save_article();
      try {
        this.articleListContainer.nativeElement.scrollTop = 0;
      } catch (e) {
        // console.log('Error in native element');
      }
    } else {
      console.log('Skipping save article');
    }
  }

  update_summary() {
    this._articleService.update_summary();
    this.current_article = this._articleService.current_article;
  }

  trim_last_empty_item() {
    if (this.articles) {
      const old_article = this.articles[0];
      if (old_article.title === '' && old_article.content === '') {
        this.articles.splice(0, 1);
        this.save_articles();
      }
    }
  }

  reset_list() {
    this.select_first_article = false;
    this.filtered_articles = this.articles;
    this._articleService.articles = this.articles;
    this._articleService.current_article = this.current_article;
    this.word_count = 0;
    this.search_term = '';
    this.update_font_class();
  }

  update_font_class() {
    if (this.current_article && this.current_article.title) {
      const headline_length = this.current_article.title.length;
      if (headline_length <= 45) {
        this.headline_font = 'form-control font-large';
      } else if (headline_length > 45 && headline_length <= 60) {
        this.headline_font = 'form-control font-normal';
      } else if (headline_length > 60) {
        this.headline_font = 'form-control font-small';
      }
    } else {
      this.headline_font = 'form-control font-large';
    }
  }

  nuke_content() {
    this.current_article.content = '';
    this.current_article.summary = '';
  }

  toggle_write_or_nuke() {
    if (this.write_or_nuke_mode) {
      this.write_or_nuke_mode = false;
      this._msgService.add('Write or Nuke mode is disabled.', 'success');
    } else {
      if (
        confirm(
          `When you enable "Write or Nuke" mode, you cannot stop typing until you complete the target number of words.
If you stop typing for more than 30 seconds, you will lose whatever you would have written till then in that article.\n

Are you sure you want to continue?`
        )
      ) {
        this.write_or_nuke_mode = true;
        const msg =
          'WARNING: Write or Nuke mode is enabled. You will lose everything you type if you stop typing till target words';
        this._msgService.add(msg, 'danger');
      }
    }
    this.config.write_or_nuke = this.write_or_nuke_mode;
    this._configService.set_config(this.config);
  }

  show_writing_prompt() {
    // console.log('Showing writing prompt wizard');
    this._modalService.open(WritingPromptComponent);
  }

  show_config() {
    // console.log('Showing config popup');
    this._modalService.open(ConfigComponent, { size: 'lg'});
  }

  backup_articles() {
    this._articleService.backup_articles(function(err, backup_path) {
      if (!err) {
        alert('Successfully backed up at ' + backup_path);
        this._msgService.add('File backed up at ' + backup_path);
      } else {
        console.log('Error in backup', err);
        alert('There was some issue with backup\n' + err);
        this._msgService.add('Could not backup file ' + err);
      }
    });
  }
}
