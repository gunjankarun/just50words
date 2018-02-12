import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subject } from 'rxjs/Subject';
import { Article } from '../../article';
import { ArticleService } from '../../service/article.service';
import { ConfigService } from '../../service/config.service';
import { MessageService } from '../../service/message.service';
import { FileService } from '../../service/file.service';
import { WordCountService } from '../../service/word-count.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
/**
 * This is the main component that shows the main editor screen.
 * This uses the ArticlesService for persistent storage of articles
 * @export
 * @class ArticlesComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})

export class ArticlesComponent implements OnInit {
  @Input() listHeight: number;
  @Input() editorHeight: number;
  @Input() editor_object: any;

  @ViewChild('articleList') private articleListContainer: ElementRef;
  config = this._configService.config;
  config_subscription: any;
  app_version = this._configService.app_version;
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
  current_article: Article;
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
    private _modalService: NgbModal
  ) {
    // constructor
    if (this._electronService.isElectronApp) {
      // this.app_version = this._electronService.remote.app.getVersion();
      this.config_folder = this._electronService.remote.getGlobal('application_root') + 'data/';
      this.config_file =  this.config_folder + '_config.json';
    }

    this.config = this._configService.config;
    // Listen for configuration changes
    this.config_subscription = _configService.configChange.subscribe(
      new_config => {
        this.config = new_config;
        this.target_words = new_config.target_words;

        this.editorMaxWidth = new_config.editor_max_width;
        this.write_or_nuke_mode = new_config.write_or_nuke;
        this.write_or_nuke_show_button = new_config.write_or_nuke_show_button;
        console.log(
          'Inside Editor Constructor and write_or_nuke_show_button=',
          this.write_or_nuke_show_button
        );
        this.editor_bg = new_config.editor_bg;
        this.editor_text_color = new_config.editor_text_color;
      }
    );

    const scope = this;
    this._articleService.load_articles(function(err, articles) {
      scope.articles = scope._articleService.articles;
      scope.reset_list();
      scope.new_article();
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.config_subscription.unsubscribe();
  }

  show_options(configPopup) {
    // will show options popup here
    this._modalService.open(configPopup).result.then(
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

  ngOnInit() {
    // On init activities
  }

  ngAfterViewInit() {
    console.log('DOM loaded');
    this.headline_object = this._elRef.nativeElement.querySelector('#headline');
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
    this.editor_object.setSelectionRange(0, 0);
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
    this.save_articles();
    this.update_summary();
    this.celebrate = this._wordCountService.celebrate;
    this.word_count = this._wordCountService.word_count;
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

    this.update_font_class();
  }

  new_article_button_click() {
    this.old_title = '';
    this.new_article();
    this.headline_object.focus();
  }

  new_article() {
    console.log('Creating new article');
    // make sure that the last empty item is trimmed
    this.trim_last_empty_item();

    this.current_article = this._articleService.get_blank_article();

    if (!this.articles) {
      this.articles = [];
    }
    this._articleService.current_article = this.current_article;
    this.articles.unshift(this.current_article);
    this.select_first_article = false;
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
  }

  update_font_class() {
    const headline_length = this.current_article.title.length;
    if (headline_length <= 45) {
      this.headline_font = 'form-control font-large';
    } else if (headline_length > 45 && headline_length <= 60) {
      this.headline_font = 'form-control font-normal';
    } else if (headline_length > 60) {
      this.headline_font = 'form-control font-small';
    }
  }

  nuke_content() {
    console.log('Content Nuked');
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
          'When you enable "Write or Nuke" mode, you cannot stop typing until you complete the target number of words.\nIf you stop typing for more than 30 seconds, you will lose whatever you have written so far.\nAre you sure you want to continue?'
        )
      ) {
        this.write_or_nuke_mode = true;
        const msg =
          'WARNING: Write or Nuke mode is enabled. You will lose everything you type if you stop typing till target words';
        this._msgService.add(msg, 'danger');
      }
    }
    this._configService.setConfig('write_or_nuke', this.write_or_nuke_mode);
  }
}
