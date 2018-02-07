import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

/**
 * This service handles audio related tasks. It is the central location to make global changes to audio events
 *
 * @export
 * @class AudioService
 */
@Injectable()
export class AudioService {
  mute_all_sound = false;
  config_subscription: any;

  constructor(private _configService: ConfigService) {
    this.mute_all_sound = _configService.config.mute_all_sound;
    this.config_subscription = _configService.configChange.subscribe(
      new_config => {
        this.mute_all_sound = new_config.mute_all_sound;
      }
    );
  }

  playSound(sound_file: string, volume = 1) {
    if (!this.mute_all_sound) {
      const audio = new Audio(sound_file);
      audio.volume = volume;
      audio.play();
    }
  }
}
