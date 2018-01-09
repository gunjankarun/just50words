import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  // Targets
  target_words = 50;
  words_in_summary = 20;
  application_root = '/Users/gunjan/Projects/just50words/';
  article_folder = this.application_root + 'articles';
  article_summary_folder = this.application_root + 'articles';
  message_dismiss_after = 5; // number of seconds after which we dismiss the notification messages
  auto_save_after = 3; // number of seconds to wait after the user stops typing to autosave articles

  // Schedule related tasks
  work_session = 15; // minutes to work
  short_break = 5; // short break sessions
  continuous_sessions = 4; // how many sessions in one set. Big break after these number of small breaks
  long_break = 10; // how long will the long break be after continuous session counts

  // Streak related parameters
  word_count_low = 100; // upto 100 words will be low
  word_count_medium = 250; // upto 250 words will be medium
  word_count_high = 500; // more than 500 words will be high

  constructor() {

  }

}
