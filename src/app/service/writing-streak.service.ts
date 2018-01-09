import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable()
export class WritingStreakService {
  streaks = [];
  target_words = this._configService.target_words;

  constructor(
    private _configService: ConfigService
  ) {
    // this.load_streak_data();
  }

  load_streak_data() {
    const streak_data = [
      {
        date: new Date('2018-01-08T09:30:51.01'),
        date_label: '8',
        articles: 3,
        words: 450,
        target: 50
      },
      {
        date: new Date('2018-01-06T09:30:51.01'),
        date_label: '6',
        articles: 3,
        words: 60,
        target: 50
      },
      {
        date: new Date('2018-01-05T09:30:51.01'),
        date_label: '5',
        articles: 1,
        words: 650,
        target: 50
      },
    ];
    return streak_data;
  }

  prepare_streak_data(num_days: number = 5) {
    const old_dates = [];
    const today = new Date();
    const today_date = today.getDate();
    const final_array = [];

    // console.log(' Today is ', today.getTime());

    for (let i = 0 ; i < num_days ; i++) {
      const old_day = today.getTime() - 1000 * 24 * 60 * 60 * i;
      const yesterday = new Date(old_day);
      old_dates.push(yesterday.getDate().toString());
      // old_dates.push(11);
      // console.log(yesterday);
    }
    // console.log(old_dates);
    const current_streak = this.load_streak_data();
    // console.log(current_streak);

    old_dates.forEach(function(dt){
      let found = false;
      let found_strk = null;
      current_streak.forEach(function(strk){
        // console.log( 'Comparing ' + dt + ' with ' + strk.date_label );
        if ( dt === strk.date_label) {
          found = true;
          // console.log ('Found dt ' + dt);
          found_strk = strk;
          return;
        }
      });
      // console.log(dt);
      // console.log ('Found strk', found_strk);
      const temp_strk = {
        date_label: dt,
        date: found_strk ? found_strk.date : 0,
        words: found_strk ? found_strk.words : 0,
        articles: found_strk ? found_strk.articles : 0,
        target: found_strk ? found_strk.target : this.target_words,
        style: ''
      };

      // console.log('Current words is ' + temp_strk.words + ' and word_count_medium is ' + this._configService.word_count_medium);
      if (temp_strk.words < temp_strk.target) {
        temp_strk.style = 'word-count-missed';
      } else if (temp_strk.words >= temp_strk.target && temp_strk.words < this._configService.word_count_low) {
        temp_strk.style = 'word-count-low';
      } else if (temp_strk.words >= this._configService.word_count_low && temp_strk.words < this._configService.word_count_medium) {
        temp_strk.style = 'word-count-medium';
      } else if (temp_strk.words >= this._configService.word_count_medium && temp_strk.words < this._configService.word_count_high) {
        temp_strk.style = 'word-count-high';
      } else if (temp_strk.words > this._configService.word_count_high) {
        temp_strk.style = 'word-count-very-high';
      }
      // console.log('Current date is ' + temp_strk.date + ' words=' + temp_strk.words + ' and style is ' + temp_strk.style);

      // console.log('Temp Streak', temp_strk);
      // this.streaks.push(temp_strk);
      final_array.push(temp_strk);
    }, this);
    this.streaks = final_array;
  }

}
