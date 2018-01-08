import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  // Targets
  target_words = 10;
  target_time = '12:00';
  words_in_summary = 6;
  application_root = '/Users/gunjan/Projects/just50words/';
  article_folder = this.application_root + 'articles';
  article_summary_folder = this.application_root + 'articles';
  message_dismiss_after = 5; // number of seconds after which we dismiss the notification messages
  auto_save_after = 3; // number of seconds to wait after the user stops typing to autosave articles

  constructor() {

  }

}
