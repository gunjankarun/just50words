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

  articles: Article[];
  filtered_articles: Article[];
  celebrate = false;
  editor_object: any;
  headline_object: any;
  headline_font = 'form-control font-large';

  target_words: number;
  target_time: string;
  // articles: Article[];
  search_term = '';
  current_article: Article;
  show_list = true;
  select_first_article = false;
  show_list_label = '<span class="oi oi-caret-left"> </span>';
  old_title: string;
  // headline_placeholder = 'Search or start here (this is the title)';

  constructor(private _articleService: ArticleService,
    private _configService: ConfigService,
    private _msgService: MessageService,
    private _elRef: ElementRef,
    private _wordCountService: WordCountService,
    private _electronService: ElectronService
  ) {
      // constructor

    // this.current_article = this._articleService.get_blank_article();
    this.new_article();
    const scope = this;
    this._articleService.load_articles(function(err, articles){
      scope.articles = scope._articleService.articles;
      // scope.filtered_articles = scope.articles;
      scope.reset_list();
    });
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
    // this.current_article = this._articleService.current_article;
    // this.new_article();
  }

  ngAfterViewInit() {
    console.log ('DOM loaded');
    this.editor_object = this._elRef.nativeElement.querySelector('#editor');
    this.headline_object = this._elRef.nativeElement.querySelector('#headline');
    // console.log(this.editor_object);
    // console.log(this.vc_editor.nativeElement.value);
  }

  select_article(article) {
    // make sure that the last empty item is trimmed
    this.trim_last_empty_item();

    this.current_article = article;
    this._articleService.current_article = this.current_article;
    this.reset_list();
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

  search_article_from_title(event) {
    // if (!this.articles) {
    //   return ;
    // }
    // this.select_first_article = true;
    // this._msgService.add('Hit Enter/Return key to add/edit this article');
    // this.search_term = this.current_article.title;
    // this.filter_articles(this.search_term);
  }

  focus_set() {
    if (this.current_article) {
      this.old_title = this.current_article.title;
    }
  }

  key_pressed_textarea(event) {
    this.update_summary();
    this.save_articles();
    this.celebrate = this._wordCountService.celebrate;

    // Play the sound
    if (this._configService.play_keypress_sound) {
      const audio = new Audio(this._configService.keypress_sound);
      const abc = 'AAA';
      audio.play();
    }

    switch (event.key) {
      case 'Enter':
        // format text
        this.format_text();
        break;
      default:
        break;
    }
  }

  key_pressed_headline(event) {
    this.update_summary();
    this.save_articles();

    // console.log(event.keyCode + ' ', event.key);

    // Do not save articles if only the headline is being changed.
    // this._articleService.save_article();
    // this.headline_placeholder = 'Search or start here (this is the title)';
    switch (event.key) {
      case 'Enter':
        if (!event.shiftKey) {
          // if (!this._articleService.current_article) {
          //   this.new_article();
          // }
        } else {
          // console.log('User clicked shift + Enter');
          // if (!this.filtered_articles.length) {
          //   // console.log('Going to create new article now');
          //   if (!this.current_article) {
          //     this.new_article();
          //   }
          // } else {
          //   // console.log('Selecting existing article to edit');
          //   const selected_article = this.filtered_articles[0];
          //   this.select_article(selected_article);
          // }
        }
        this.editor_object.focus();
        // reset the filtered articles list
        // this.filtered_articles = this.articles;

        // disable selecting the first article
        // this.select_first_article = false;
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

    this.update_font_class();
  }

  new_article_button_click() {
    this.old_title = '';
    // this.headline_placeholder = 'Start typing here';
    // this.current_article = this._articleService.get_blank_article();
    // this._articleService.current_article = this.current_article;
    // this._articleService.articles.unshift(this.current_article);
    this.new_article();
    this.headline_object.focus();
  }

  new_article() {
    console.log ('Creating new article');
    // make sure that the last empty item is trimmed
    this.trim_last_empty_item();

    // first copy the current title
    // if (!this.current_article) {
    //   this.current_article = this._articleService.get_blank_article();
    // }
    // const temp_title = this.current_article.title;
    // const temp_content = this.current_article.content;

    // // Now check if there was an old title
    // if (this.old_title) {
    //   this.current_article.title = this.old_title;
    //   this.old_title = '';
    // }

    this.current_article = this._articleService.get_blank_article();
    // this.current_article.title = temp_title;
    // if (temp_content) {
    //   const confirm_msg = `You are about to start a new article\nDo you want to clear the contents?\n\nOk will give you a blank slate.`;
    //   const start_new = confirm(confirm_msg);
    //   if (!start_new) {
    //     this.current_article.content = temp_content;
    //   }
    // }

    if (!this.articles) {
      this.articles = [];
    }
    this._articleService.current_article = this.current_article;
    this.articles.unshift(this.current_article);
    this.save_articles();
    this.select_first_article = false;
  }

  filter_articles(filter_str: string) {
    if (!this.articles) {
      return;
    }
    // this.filtered_articles = this.articles;
    // console.log('Searching for ' + filter_str + ' and filtered articles are ' + this.filtered_articles.length);
    filter_str = filter_str.toLowerCase();
    this.filtered_articles = this.articles.filter(function (item) {
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
      // console.log('Entering save article');
      this.filtered_articles = this.articles;
      this._articleService.articles = this.articles;
      this._articleService.current_article = this.current_article;
      this._articleService.save_article();
    }else {
      console.log('Skipping save article');
    }
  }

  update_summary() {
    // this._articleService.current_article = this.current_article;
    this._articleService.update_summary();
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
    this.search_term = '';
  }

  update_font_class() {
    const headline_length = this.current_article.title.length;
    if (headline_length <= 45) {
      this.headline_font = 'form-control font-large';
    } else if (headline_length > 45 && headline_length <= 60) {
      this.headline_font = 'form-control font-normal';
    }else if (headline_length > 60 ) {
      this.headline_font = 'form-control font-small';
    }
  }

  format_text() {

    const start_pos = this.editor_object.selectionStart;
    const end_pos = this.editor_object.selectionEnd;
    // console.log ('selection start = ' + start_pos + ' and sel end = ' + end_pos);
    const content_till_cursor = this.current_article.content.substr(0, start_pos);
    // console.log('content_till_cursor', content_till_cursor);
    const lines = content_till_cursor.split('\n');
    const last_line = lines.length ? lines[lines.length - 2] : '';
    const index_space = last_line.search(/\S|$/);
    // console.log('index space', index_space);
    let spaces = '';
    if (index_space) {
      for (let i = 0; i < index_space; i++) {
        spaces = spaces + ' ';
      }
    }

    // get bullet chars
    const first_two_chars: string = last_line.substr(index_space, 2);
    const arr_first_two_chars = first_two_chars.split('');
    // console.log('First two chars are ', arr_first_two_chars);
    if (arr_first_two_chars && arr_first_two_chars.length === 2) {
      if (arr_first_two_chars[1] === ' ') {
        const first_char = arr_first_two_chars[0];
        const letters = /^[0-9a-zA-Z]+$/;
        const is_alphanumeric = first_char.match(letters);
        // console.log('Alpha numeric is ', is_alphanumeric);
        if (!is_alphanumeric){
          spaces = spaces + arr_first_two_chars.join('');
        }
      }
    }

    // Now create numbered list
    const numbers_found = last_line.match(/(^[\s\d]+)(.+$)/i);
    console.log('Numbers found', numbers_found);
    if (numbers_found) {
      const number_found = numbers_found[1];
      const number_separator: string = last_line.substr(number_found.length, 2);
      const arr_number_separator = number_separator.split('');
      if (arr_number_separator && arr_number_separator.length === 2) {
        if (arr_number_separator[1] === ' ') {
          const first_char = arr_number_separator[0];
          if (first_char === '.') {
            const new_number = +number_found + 1;
            spaces = spaces + new_number + arr_number_separator.join('');
            // todo: now need to parse all future lines and if number found in future lines, then we update those numbers as well
          }
        }
      }
    }

    // Update the text with bullets or indents
    if (spaces) {
      this.current_article.content = content_till_cursor + spaces + this.current_article.content.substr(end_pos, this.current_article.content.length);
      // console.log('About to set selection start = ' + start_pos + ' and sel end = ' + end_pos);
      this.editor_object.setSelectionRange(start_pos, end_pos);
      // this.editor.nativeElement.setSelectionRange(start_pos, start_pos);
      // const elem = document.getElementById('editor');
      // elem.focus();
      // elem.setSelectionRange(start_pos, start_pos);
    }
  }

  // setSelectionRange(input, selectionStart, selectionEnd) {
  //   if (input.setSelectionRange) {
  //     console.log('in selection range');
  //     input.focus();
  //     input.setSelectionRange(selectionStart, selectionEnd);
  //   } else if (input.createTextRange) {
  //     console.log('in createTextRange');
  //     const range = input.createTextRange();
  //     range.collapse(true);
  //     range.moveEnd('character', selectionEnd);
  //     range.moveStart('character', selectionStart);
  //     range.select();
  //   }
  // }

}
