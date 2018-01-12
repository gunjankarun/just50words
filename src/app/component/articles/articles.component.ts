import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Article } from '../../article';
import { ArticleService } from '../../service/article.service';
import { ConfigService } from '../../service/config.service';
import { MessageService } from '../../service/message.service';
import { FileService } from '../../service/file.service';
import { WordCountService } from '../../service/word-count.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  @Input() listHeight: number;
  @Input() editorHeight: number;
  celebrate = false;
  editor_object: any;
  headline_object: any;

  target_words: number;
  target_time: string;
  // articles: Article[];
  search_term = '';
  search_term_1 = '';
  current_article: Article;
  show_list = true;
  select_first_article = false;
  show_list_label = '<span class="oi oi-caret-left"> </span>';
  old_title: string;
  headline_placeholder = 'Search or start here (this is the title)';

  constructor(private _articleService: ArticleService,
    private _configService: ConfigService,
    private _msgService: MessageService,
    private _elRef: ElementRef,
    private _wordCountService: WordCountService,
    private _electronService: ElectronService
  ) {
      // constructor
  }

  launch_window() {
    if (this._electronService.isElectronApp) {
      this._electronService.shell.openExternal('https://google.com');
    }else {
      console.log ('Not an electron app. hence could not launch_window');
    }
  }

  ngOnInit() {
    this.target_words = this._configService.target_words;
    this.current_article = this._articleService.get_blank_article();
  }

  ngAfterViewInit() {
    console.log ('DOM loaded');
    this.editor_object = this._elRef.nativeElement.querySelector('#editor');
    this.headline_object = this._elRef.nativeElement.querySelector('#headline');
    // console.log(this.editor_object);
    // console.log(this.vc_editor.nativeElement.value);
  }

  select_article(article) {
    this._articleService.current_article = article;
    this.current_article = this._articleService.current_article;
    this.search_term = '';
    this._msgService.add('Loaded article "' +  article.title + '"', 'info');
    this.editor_object.focus();
  }

  toggle_list() {
    console.log('Toggling List');
    this.show_list = !this.show_list;
    if (this.show_list) {
      this.show_list_label = '<span class="oi oi-caret-left"></span>';
    } else {
      this.show_list_label = '<span class="oi oi-caret-right"></span>';
    }
  }

  search_article_from_search() {
    // console.log('Search term is ', this.search_term);
    this._articleService.filter_articles(this.search_term);
    // if (!this._articleService.filtered_articles.length) {
    //   console.log('Search term with this article not found');
    // }
  }

  search_article_from_title(event) {
    if (!this._articleService.articles) {
      return ;
    }
    // console.log('Search Article triggered', event);
    // Do not search on title typing if the user is already working on an article
    if (this._articleService.current_article) {
      return false;
    }
    this.select_first_article = true;
    this._msgService.add('Hit Enter/Return key to add/edit this article');
    this.search_term = this.current_article.title;
    this._articleService.filter_articles(this.search_term);
    if (!this._articleService.filtered_articles.length) {
      console.log('Search term with this article not found');
    }
  }

  focus_set() {
    if (this.current_article) {
      this.old_title = this.current_article.title;
    }
  }

  key_pressed_textarea(event) {
    this._articleService.update_summary();
    this._articleService.save_article();
    this.celebrate = this._wordCountService.celebrate;
  }

  key_pressed_headline(event) {
    // console.log(event.keyCode + ' ', event.key);

    // Do not save articles if only the headline is being changed.
    // this._articleService.save_article();
    this.headline_placeholder = 'Search or start here (this is the title)';
    switch (event.key) {
      case 'Enter':
        if (!event.shiftKey) {
          this.new_article();
        } else {
          // console.log('User clicked shift + Enter');
          if (!this._articleService.filtered_articles.length) {
            // console.log('Going to create new article now');
            if (!this._articleService.current_article) {
              this.new_article();
            }
          } else {
            // console.log('Selecting existing article to edit');
            const selected_article = this._articleService.filtered_articles[0];
            this.select_article(selected_article);
          }
        }
        this.editor_object.focus();
        // reset the filtered articles list
        this._articleService.filtered_articles = this._articleService.articles;

        // disable selecting the first article
        this.select_first_article = false;
        break;

      case 's':
        // console.log('User clicked s');
        if (event.ctrlKey) {
          // console.log('User clicked control + S');
        }
        // do nothing right now.
        break;
      default:
        break;
    }
  }

  new_article_button_click() {
    this.old_title = '';
    this.headline_placeholder = 'Start typing here. Hit enter to save';
    this.current_article = this._articleService.get_blank_article();
    this._articleService.current_article = this.current_article;
    this._articleService.articles.unshift(this.current_article);
    this.headline_object.focus();
  }

  new_article() {
    console.log ('Creating new article');
    // first copy the current title
    const temp_title = this.current_article.title;
    const temp_content = this.current_article.content;

    // Now check if there was an old title
    if (this.old_title) {
      this.current_article.title = this.old_title;
      this.old_title = '';
    }

    this.current_article = this._articleService.get_blank_article();
    this.current_article.title = temp_title;
    if (temp_content) {
      const confirm_msg = `You are about to start a new article\nDo you want to clear the contents?\n\nOk will give you a blank slate.`;
      const start_new = confirm(confirm_msg);
      if (!start_new) {
        this.current_article.content = temp_content;
      }
    }
    this._articleService.current_article = this.current_article;
    if (!this._articleService.articles) {
      this._articleService.articles = [];
    }
    this._articleService.articles.unshift(this.current_article);
  }

}
