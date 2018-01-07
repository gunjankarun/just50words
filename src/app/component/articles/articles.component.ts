import { Component, OnInit, Input } from '@angular/core';
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
  target_words: number;
  target_time: string;
  articles: Article[];
  search_term: string;
  current_article: Article;
  show_list = true;
  show_list_label = '<span class="oi oi-caret-left"> </span>';

  constructor(private articleService: ArticleService,
    private configService: ConfigService,
    private msgService: MessageService,
    private fileService: FileService) {
      // constructor
  }

  ngOnInit() {
    this.target_words = this.configService.target_words;
    this.target_time = this.configService.target_time;
    this.articles = this.articleService.get_articles();
    console.log('Articles imported:', this.articles.length);

    this.current_article = this.articleService.get_blank_article();
  }

  select_article(article) {
    this.articleService.current_article = article;
    this.current_article = this.articleService.current_article;
    this.msgService.add('Loaded article "' +  article.title + '"', 'info');
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

  schedule_autosave(event) {
    this.articleService.auto_save_start();
  }

}
