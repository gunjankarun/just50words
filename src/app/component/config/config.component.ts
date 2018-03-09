import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { ConfigService } from '../../service/config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit, OnDestroy {
  config = this._configService.config;
  config_subscription: Subscription;
  constructor(
    public activeModal: NgbActiveModal,
    private _configService: ConfigService
  ) {
    this.config_subscription = this._configService.cast.subscribe(
      new_config => {
        this.config = new_config;
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.config_subscription.unsubscribe();
  }

  onSubmit(event) {
    event.preventDefault();
    this._configService.set_config(this.config);
    const scope = this;
    this._configService.save_config(this.config, function(err, new_config){
      if (err) {
        console.log('Error in saving config file', err);
      }else {
        console.log('Config file saved successfully');
        scope.activeModal.dismiss('Config Saved');
      }
    });
  }

  is_sound_enabled(prop: string) {
    if (this.config.mute_all_sound) {
      return false;
    } else if (prop) {
      if (this.config[prop]) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  reset_config() {
    this.config = this._configService.get_default_config();
  }


}
