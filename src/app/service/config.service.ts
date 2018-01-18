import { Injectable } from '@angular/core';
import { Constants } from '../constants';

@Injectable()
export class ConfigService {
  // Targets
  target_words = 50;
  target_words_countdown_type = Constants.WORD_COUNT_TYPE.WORD_COUNT;
  words_in_summary = 20;
  application_root = '/Users/gunjan/Projects/just50words/';
  article_folder = this.application_root + 'articles';
  article_summary_folder = this.application_root + 'articles';
  message_dismiss_after = 5; // number of seconds after which we dismiss the notification messages
  auto_save_after = 1; // number of seconds to wait after the user stops typing to autosave articles
  target_reached_sound = 'assets/sound/notification-sound.mp3';
  play_target_reached_sound = true;

  play_keypress_sound = false;
  keypress_sound = 'assets/sound/tick.wav';

  // Schedule related tasks
  play_session_completed_sound = true;
  session_celebration_duration = 3 ; // how long will the celebration banner last

  work_session = 10; // minutes to work
  work_session_complete_sound = 'assets/sound/filling.mp3';

  short_break = 5; // short break sessions
  short_break_complete_sound = 'assets/sound/relentless.mp3';

  continuous_sessions = 2; // how many sessions in one set. Big break after these number of small breaks
  long_break = 15; // how long will the long break be after continuous session counts
  long_break_complete_sound = 'assets/sound/glass-breaking.mp3';

  // Streak related parameters
  word_count_low = 100; // upto 100 words will be low
  word_count_medium = 250; // upto 250 words will be medium
  word_count_high = 500; // more than 500 words will be high

  constructor() {}
}
