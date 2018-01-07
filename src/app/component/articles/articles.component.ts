import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Article } from '../../article';
import { ArticleService } from '../../service/article.service';
import { ConfigService } from '../../service/config.service';
import { MessageService } from '../../service/message.service';
import { FileService } from '../../service/file.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  @Input() listHeight: number;
  @Input() editorHeight: number;
  editor_object: any;
  headline_object: any;

  target_words: number;
  target_time: string;
  // articles: Article[];
  search_term: string;
  current_article: Article;
  show_list = true;
  select_first_article = false;
  show_list_label = '<span class="oi oi-caret-left"> </span>';
  old_title: string;

  constructor(private articleService: ArticleService,
    private configService: ConfigService,
    private msgService: MessageService,
    private fileService: FileService,
    private elRef: ElementRef) {
      // constructor
  }

  ngOnInit() {
    this.target_words = this.configService.target_words;
    this.target_time = this.configService.target_time;
    // this.articles = this.articleService.get_articles();
    console.log('Articles imported:', this.articleService.articles.length);

    this.current_article = this.articleService.get_blank_article();
    // this.articleService.current_article = this.current_article;
    // this.articleService.articles.unshift(this.current_article);

    this.articleService.filtered_articles = this.articleService.articles;
  }

  ngAfterViewInit() {
    console.log ('DOM loaded');
    this.editor_object = this.elRef.nativeElement.querySelector('#editor');
    this.headline_object = this.elRef.nativeElement.querySelector('#headline');
    // console.log(this.editor_object);
    // console.log(this.vc_editor.nativeElement.value);
  }
  select_article(article) {
    this.articleService.current_article = article;
    this.current_article = this.articleService.current_article;
    this.search_term = '';
    this.msgService.add('Loaded article "' +  article.title + '"', 'info');
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

  search_article(event) {
    // console.log('Search Article triggered', event);
    // Do not search on title typing if the user is already working on an article
    if (this.articleService.current_article) {
      return false;
    }
    this.select_first_article = true;
    this.msgService.add('Hit Enter/Return key to add/edit this article');
    this.search_term = this.current_article.title;
    this.articleService.filter_articles(this.search_term);
    if (!this.articleService.filtered_articles.length) {
      console.log('Search term with this article not found');
    }
  }

  focus_set() {
    if (this.current_article) {
      this.old_title = this.current_article.title;
    }
  }

  key_pressed(event) {
    // console.log(event.keyCode + ' ', event.key);
    this.articleService.update_summary();
    if (!this.articleService.current_article) {
      // this.new_article();
      // do nothing
    }else {
    this.articleService.auto_save_start();
    }

    switch (event.key) {
      case 'Enter':
        if (!event.shiftKey) {
          this.new_article();
        } else {
          console.log('User clicked shift + Enter');
          if (!this.articleService.filtered_articles.length) {
            console.log('Going to create new article now');
            if (!this.articleService.current_article) {
              this.new_article();
            }
          } else {
            console.log('Selecting existing article to edit');
            let selected_article = this.articleService.filtered_articles[0];
            this.select_article(selected_article);
          }
        }
        this.editor_object.focus();
        // reset the filtered articles list
        this.articleService.filtered_articles = this.articleService.articles;

        // disable selecting the first article
        this.select_first_article = false;
        break;

      case 's':
        console.log('User clicked s');
        if (event.ctrlKey) {
          console.log('User clicked control + S');
        }
        // do nothing right now.
        break;
      default:
        break;
    }
  }

  new_article_button_click() {
    this.old_title = '';
    this.current_article = this.articleService.get_blank_article();
    this.articleService.current_article = this.current_article;
    this.articleService.articles.unshift(this.current_article);
    this.headline_object.focus();
  }

  new_article() {
    console.log ('Creating new article');
    // first copy the current title
    let temp_title = this.current_article.title;

    // Now check if there was an old title
    if (this.old_title) {
      this.current_article.title = this.old_title;
      this.old_title = '';
    }

    this.current_article = this.articleService.get_blank_article();
    this.current_article.title = temp_title;
    this.articleService.current_article = this.current_article;
    this.articleService.articles.unshift(this.current_article);
  }

}
