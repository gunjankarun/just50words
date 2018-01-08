import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';

import { AppComponent } from './app.component';
import { ArticlesComponent } from './component/articles/articles.component';
import { MessageComponent } from './component/message/message.component';
import { WordCountComponent } from './component/word-count/word-count.component';
import { WritingTimerComponent } from './component/writing-timer/writing-timer.component';

import { ArticleService } from './service/article.service';
import { ConfigService } from './service/config.service';
import { MessageService } from './service/message.service';
import { FileService } from './service/file.service';
import { WordCountService } from './service/word-count.service';

import { FilterArticlesPipe } from './pipe/filter-articles.pipe';
import { TimeAgoPipe } from './pipe/time-ago.pipe';
import { WordCountPipe } from './pipe/word-count.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent,
    FilterArticlesPipe,
    MessageComponent,
    TimeAgoPipe,
    WordCountComponent,
    WordCountPipe,
    WritingTimerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxElectronModule
  ],
  providers: [ArticleService, ConfigService, MessageService, FileService, WordCountService],
  bootstrap: [AppComponent]
})
export class AppModule { }
