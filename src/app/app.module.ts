import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ArticlesComponent } from './component/articles/articles.component';
import { ArticleService } from './service/article.service';
import { ConfigService } from './service/config.service';
import { MessageService } from './service/message.service';
import { FilterArticlesPipe } from './pipe/filter-articles.pipe';
import { MessageComponent } from './component/message/message.component';


@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent,
    FilterArticlesPipe,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [ArticleService, ConfigService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
