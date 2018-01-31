import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable()
export class AudioService {
  mute_all_sound = false;
  config_subscription: any;

  constructor(private _configService: ConfigService) {
    // console.log('AUDIO::: CALLED');
    this.mute_all_sound = _configService.config.mute_all_sound;
    this.config_subscription = _configService.configChange.subscribe(
      new_config => {
        this.mute_all_sound = new_config.mute_all_sound;
        // console.log('\n\nAUDIO::: mute_all_sound=' + this.mute_all_sound);
      }
    );
  }

  playSound(sound_file: string, volume = 1) {
    // console.log(this.mute_all_sound + ' Playing audio ' + sound_file + ' at volume: ' + volume);
    if (!this.mute_all_sound) {
      const audio = new Audio(sound_file);
      audio.volume = volume;
      audio.play();
    }
  }
}
