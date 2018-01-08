import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ArticlesComponent } from './component/articles/articles.component';
import { MessageComponent } from './component/message/message.component';

import { ArticleService } from './service/article.service';
import { ConfigService } from './service/config.service';
import { MessageService } from './service/message.service';
import { FileService } from './service/file.service';

import { FilterArticlesPipe } from './pipe/filter-articles.pipe';
import { TimeAgoPipe } from './pipe/time-ago.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent,
    FilterArticlesPipe,
    MessageComponent,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [ArticleService, ConfigService, MessageService, FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
