import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ConfigService } from './config.service';

/**
 * This service handles audio related tasks. It is the central location to make global changes to audio events
 *
 * @export
 * @class AudioService
 */
@Injectable()
export class AudioService implements OnDestroy {
  mute_all_sound = false;
  global_sound_volume = 1;
  config_subscription: Subscription;

  constructor(private _configService: ConfigService) {
    this.mute_all_sound = _configService.config.mute_all_sound;

    this.config_subscription = this._configService.cast.subscribe(
      new_config => {
        this.mute_all_sound = new_config.mute_all_sound;
        this.global_sound_volume = new_config.global_sound_volume;
      }
    );
  }

  ngOnDestroy() {
    this.config_subscription.unsubscribe();
  }

  playSound(sound_file: string, volume = this.global_sound_volume) {
    if (!this.mute_all_sound) {
      const audio = new Audio(sound_file);
      audio.volume = volume;
      audio.play();
    }
  }
}
