import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { WordCountService } from '../../service/word-count.service';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-writing-timer',
  templateUrl: './writing-timer.component.html',
  styleUrls: ['./writing-timer.component.css']
})

export class WritingTimerComponent implements OnInit {
  timer_label = '12:34';
  play_pause_icon = 'oi-media-play';
  class = 'btn-outline-dark';
  class_old = '';
  session_label = 'Start';
  session_label_old = '';
  wait_to_start = false;

  total_time = 0;
  session_time = 0;
  session_count = 0;
  break_count = 0;
  session_type = 'work';

  tick = 1000;
  timer_on = false;
  timer: any;

  target_time = this._configService.work_session * 60   ; // convert minutes to seconds

  constructor(
    private _configService: ConfigService,
    private _msgService: MessageService,
    private _wordCountService: WordCountService
  ) {}

  ngOnInit() {
    this.timer_label = this.format_timer(this.target_time);
  }

  toggle_timer() {
    if (this.timer_on) {
      this.session_label_old = this.session_label;
      this.class_old = this.class;
      this.session_label = 'Resume';
      this.play_pause_icon = 'oi-media-play';
      this.stop_timer();
      this.timer_on = false;
      this.class = 'btn-secondary';
    }else {
      if (this.session_count) {
        this.session_label = this.session_label_old;
        this.class = this.class_old;
      } else {
        this.session_label = 'Write';
        this.class = 'btn-warning';
      }
      this.play_pause_icon = 'oi-media-pause';
      this.tick_tock();
      this.timer_on = true;
    }
  }

  tick_tock() {
    // set the countdown timer
    this.timer = setTimeout(() => {
      this.total_time++;
      this.session_time++ ;
      // console.log(' session_time= ' + this.session_time + ' target_time ' + this.target_time);

      if (this.session_time < this.target_time) {
        // do nothing
      } else {
        // if current session is work, play the session over sound
        if (this._configService.play_session_completed_sound) {
          let audio: any;
          switch (this.session_type) {
            case 'work':
              // console.log('Playing work completed sound');
              audio = new Audio(this._configService.work_session_complete_sound);
              audio.play();
              break;
            case 'relax':
              // console.log('Playing relax completed sound');
              audio = new Audio(this._configService.short_break_complete_sound);
              audio.play();
              break;
            case 'long-relax':
              // console.log('Playing long-relax completed sound');
              audio = new Audio(this._configService.long_break_complete_sound);
              audio.play();
              break;
            default:
              break;
          }
        }
        // console.log('100');
        if (this._configService.manually_start_session) {
          // console.log('200');
          if (this.session_type !== 'work') {
            // console.log('300');
            this.wait_to_start = true;
          }
        }

        // if (!this.wait_to_start) {
        //   console.log('400');
          this.change_session();
        // }

      }

      let display_time = this.session_time;
      if (this.session_time < this.target_time) {
        display_time = this.target_time - this.session_time;
      }

      this.timer_label = this.format_timer(display_time);
      if (!this.wait_to_start) {
        this.tick_tock();
      }else {
        this.wait_to_start = false;
      }
    }, this.tick);

  }

  change_session() {

    // get session count and figure out if it is write or relax session and reset session count
    // reset session time
    // console.log('500 Changing session from ', this.session_type);
    this.session_time = 0;

    if (this.session_type === 'work') {
      this.break_count++;
      this.session_count = this.break_count + 2;
      if (this.break_count % this._configService.continuous_sessions) {
        this.session_label = 'Relax';
        this.session_type = 'relax';
        this.target_time = this._configService.short_break * 60;
        this._msgService.add('Relax. Take a ' + this._configService.short_break + ' minutes break.');
      }else {
        this.session_label = 'Break';
        this.session_type = 'long-relax';
        this.target_time = this._configService.long_break * 60;
        this._msgService.add('Good job. You completed '+ this.break_count + ' sessions. Take a ' + this._configService.long_break + ' minutes break.');
      }
      this.class = 'btn-primary';
    }else {
      this.session_type = 'work';
      const temp_count = this.break_count + 1;
      this.session_label = 'Write [' + temp_count + ']';
      this.target_time = this._configService.work_session * 60;
      this.class = 'btn-warning';
      this.target_time = this._configService.work_session * 60;
      this._msgService.add('Let\'s get back to writing. Write for ' + this._configService.work_session + ' minutes.');
    }

    if (this.wait_to_start) {
      this.toggle_timer();
    }
  }

  reset_timer() {
    this.timer_label = this.format_timer(this.target_time);
    this.total_time = 0;
    this.stop_timer();
  }

  stop_timer() {
    console.log('Stop timer is called');
    clearTimeout(this.timer);
    this.play_pause_icon = 'oi-media-play';
  }

  format_timer(display_time: number) {
    let formatted_time = '';

    const hours = Math.floor(display_time / 3600);
    display_time = display_time - hours * 3600;
    const minutes = Math.floor(display_time / 60);
    const seconds = display_time - minutes * 60;
    if (hours > 0) {
      formatted_time = hours + ':';
    }
    formatted_time = formatted_time + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);

    return formatted_time;
  }

}
