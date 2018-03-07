import { Inject, Injectable } from '@angular/core';
import { FileService } from './file.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Constants } from '../constants';
import { ElectronService } from 'ngx-electron';
import { Subject } from 'rxjs/Subject';

/**
 * This is the service that handles config parameters across the application
 *
 * @export
 * @class ConfigService
 */
@Injectable()
export class ConfigService {
  app_version = '0.0.0';

  config = this.get_default_config();

  configObject = new BehaviorSubject<any>(this.config);
  cast = this.configObject.asObservable();

  // configChange: Subject<any> = new Subject<any>();

  constructor(
    private _fileService: FileService,
    private _electronService: ElectronService
  ) {
    if (this._electronService.isElectronApp) {
      this.app_version = this._electronService.remote.app.getVersion();
    }
    this.load_config();
  }

  /**
   * Use to get the data found in the config array
   *
   * @param {*} key
   * @returns
   * @memberof ConfigService
   */
  public getConfig(key: any) {
    return this.config[key];
  }

  /**
   * Use to set the data found in the config array
   *
   * @param {*} key
   * @param {*} value
   * @returns
   * @memberof ConfigService
   */
  public setConfig(key: any, value: any) {
    return (this.config[key] = value);
  }

  /**
   * Load the config parameter from a file
   *
   * @memberof ConfigService
   */
  load_config() {
    // load the configuration data
    const scope = this;
    this._fileService.load_config(this.config, function(err, config_data) {
      if (err) {
        console.log('Error in loading config', err);
        // Show some message in the message box
      }

      if (!config_data) {
        return false;
      }

      if (config_data.hasOwnProperty('target_words')) {
        scope.config.target_words = config_data.target_words;
      }
      if (config_data.hasOwnProperty('target_words_countdown_type')) {
        scope.config.target_words_countdown_type =
          config_data.target_words_countdown_type;
      }
      if (config_data.hasOwnProperty('editor_bg')) {
        scope.config.editor_bg = config_data.editor_bg;
      }
      if (config_data.hasOwnProperty('editor_text_color')) {
        scope.config.editor_text_color = config_data.editor_text_color;
      }
      if (config_data.hasOwnProperty('mute_all_sound')) {
        scope.config.mute_all_sound = config_data.mute_all_sound;
      }
      if (config_data.hasOwnProperty('target_reached_sound')) {
        scope.config.target_reached_sound = config_data.target_reached_sound;
      }
      if (config_data.hasOwnProperty('play_target_reached_sound')) {
        scope.config.play_target_reached_sound =
          config_data.play_target_reached_sound;
      }
      if (config_data.hasOwnProperty('editor_max_width')) {
        scope.config.editor_max_width = config_data.editor_max_width;
      }
      if (config_data.hasOwnProperty('play_keypress_sound')) {
        scope.config.play_keypress_sound = config_data.play_keypress_sound;
      }
      if (config_data.hasOwnProperty('keypress_sound')) {
        scope.config.keypress_sound = config_data.keypress_sound;
      }
      if (config_data.hasOwnProperty('write_or_nuke')) {
        scope.config.write_or_nuke = config_data.write_or_nuke;
      }
      if (config_data.hasOwnProperty('write_or_nuke_interval')) {
        scope.config.write_or_nuke_interval =
          config_data.write_or_nuke_interval;
      }
      if (config_data.hasOwnProperty('write_or_nuke_show_button')) {
        scope.config.write_or_nuke_show_button =
          config_data.write_or_nuke_show_button;
      }

      if (config_data.hasOwnProperty('write_or_nuke_warning_sound')) {
        scope.config.write_or_nuke_warning_sound =
          config_data.write_or_nuke_warning_sound;
      }
      if (config_data.hasOwnProperty('write_or_nuke_nuked_sound')) {
        scope.config.write_or_nuke_nuked_sound =
          config_data.write_or_nuke_nuked_sound;
      }
      if (config_data.hasOwnProperty('manually_start_session')) {
        scope.config.manually_start_session =
          config_data.manually_start_session;
      }
      if (config_data.hasOwnProperty('play_session_completed_sound')) {
        scope.config.play_session_completed_sound =
          config_data.play_session_completed_sound;
      }
      if (config_data.hasOwnProperty('session_celebration_duration')) {
        scope.config.session_celebration_duration =
          config_data.session_celebration_duration;
      }
      if (config_data.hasOwnProperty('work_session')) {
        scope.config.work_session = config_data.work_session;
      }
      if (config_data.hasOwnProperty('work_session_complete_sound')) {
        scope.config.work_session_complete_sound =
          config_data.work_session_complete_sound;
      }
      if (config_data.hasOwnProperty('short_break')) {
        scope.config.short_break = config_data.short_break;
      }
      if (config_data.hasOwnProperty('short_break_complete_sound')) {
        scope.config.short_break_complete_sound =
          config_data.short_break_complete_sound;
      }
      if (config_data.hasOwnProperty('continuous_sessions')) {
        scope.config.continuous_sessions = config_data.continuous_sessions;
      }
      if (config_data.hasOwnProperty('long_break')) {
        scope.config.long_break = config_data.long_break;
      }
      if (config_data.hasOwnProperty('long_break_complete_sound')) {
        scope.config.long_break_complete_sound =
          config_data.long_break_complete_sound;
      }
      if (config_data.hasOwnProperty('check_for_updates_automatically')) {
        scope.config.check_for_updates_automatically =
          config_data.check_for_updates_automatically;
      }

      if (config_data.hasOwnProperty('global_sound_volume')) {
        scope.config.global_sound_volume = config_data.global_sound_volume;
      }

      // scope.configChange.next(scope.config);
      scope.set_config(scope.config);
    });
  }

  set_config(config) {
    this.config = config;
    this.configObject.next(this.config);
  }

  save_config(config, next) {
    this._fileService.save_config_file(config, function(err, new_config){
      next();
    });
  }

  reset_config() {
    // reset config
    const default_config = this.get_default_config();
    this.set_config(default_config);
  }

  get_default_config() {
    const   config = {
      editor_bg: 'url("assets/images/bg-dirty-paper.jpg")',
      editor_text_color: 'black',
      target_words: 50,
      target_words_countdown_type: 'to_target',
      target_reached_sound: 'assets/sound/notification-sound.mp3',
      mute_all_sound: false,
      global_sound_volume: 0.5,
      play_target_reached_sound: true,
      editor_max_width: 800,
      play_keypress_sound: true,
      keypress_sound: 'assets/sound/tick.wav',
      write_or_nuke: false,
      write_or_nuke_interval: 30,
      write_or_nuke_nuked_sound: 'assets/sound/glass-breaking.mp3',
      write_or_nuke_warning_sound:
        'assets/sound/pin_dropping-Brian_Rocca-2084700791.mp3',
      write_or_nuke_show_button: true,
      manually_start_session: true,
      play_session_completed_sound: true,
      session_celebration_duration: 3,
      work_session: 15,
      work_session_complete_sound: 'assets/sound/relentless.mp3',
      short_break: 5,
      short_break_complete_sound: 'assets/sound/filling.mp3',
      continuous_sessions: 3,
      long_break: 15,
      long_break_complete_sound: 'assets/sound/filling.mp3',
      words_in_summary: 20,
      auto_save_after: 2,
      message_dismiss_after: 5,
      check_for_updates_automatically: true
    };
    return config;
  }
}
