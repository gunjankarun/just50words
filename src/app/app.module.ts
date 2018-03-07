import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ArticlesComponent } from './component/articles/articles.component';
import { MessageComponent } from './component/message/message.component';
import { WordCountComponent } from './component/word-count/word-count.component';
import { WritingTimerComponent } from './component/writing-timer/writing-timer.component';
// import { AppConfig } from './app.config';

import { ArticleService } from './service/article.service';
import { ConfigService } from './service/config.service';
import { MessageService } from './service/message.service';
import { FileService } from './service/file.service';
import { WordCountService } from './service/word-count.service';

import { FilterArticlesPipe } from './pipe/filter-articles.pipe';
import { TimeAgoPipe } from './pipe/time-ago.pipe';
import { WordCountPipe } from './pipe/word-count.pipe';
import { WritingStreakComponent } from './component/writing-streak/writing-streak.component';
import { WritingStreakService } from './service/writing-streak.service';
import { EditorComponent } from './component/editor/editor.component';
import { AudioService } from './service/audio.service';
import { UpdateService } from './service/update.service';
import { UpdateComponent } from './component/update/update.component';
import { WritingPromptComponent } from './component/writing-prompt/writing-prompt.component';
import { WritingPromptService } from './service/writing-prompt.service';
import { ConfigComponent } from './component/config/config.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent,
    FilterArticlesPipe,
    MessageComponent,
    TimeAgoPipe,
    WordCountComponent,
    WordCountPipe,
    WritingTimerComponent,
    WritingStreakComponent,
    EditorComponent,
    UpdateComponent,
    WritingPromptComponent,
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxElectronModule,
    NgbModule.forRoot(),
    HttpClientModule
  ],
  entryComponents: [WritingPromptComponent, ConfigComponent],
  providers: [
    ArticleService,
    ConfigService,
    MessageService,
    FileService,
    WordCountService,
    WritingStreakService,
    AudioService,
    UpdateService,
    WritingPromptService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
