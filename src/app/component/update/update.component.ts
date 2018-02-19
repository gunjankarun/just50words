import { Component,
  OnInit,
  Input,
  Output,
  EventEmitter
 } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { Constants } from '../../constants';
import { UpdateService } from '../../service/update.service';
import { ElectronService } from 'ngx-electron';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  app_version = this._configService.app_version;
  git_username = Constants.git_username;
  git_repo_name = Constants.git_repo_name;
  version_str = 'Current version: ' +
    this.app_version +
    ' (Checking for updates)';
  version_url = Constants.product_website;
  update_data = {
    latest_version: '',
    title: '',
    msg: '',
    release_url: ''
  };
  constructor(
    private _configService: ConfigService,
    private _updateService: UpdateService,
    private _electronService: ElectronService,
    private _modalService: NgbModal
  ) {}

  ngOnInit() {
    // this.app_version = this._configService.app_version;
    this.check_update();
  }

  show_update_popup(updatePopup) {
    // will show options popup here
    this._modalService.open(updatePopup).result.then(
      result => {
        // console.log(`Closed with: ${result}`);
      },
      reason => {
        // console.log(`Dismissed ${reason}`);
      }
    );
  }

  check_update() {
    const scope = this;
    this._updateService.check_update(this.app_version, this.git_username, this.git_repo_name,  function(err, update_obj){
      scope.version_str = update_obj.title;
      scope.version_url = update_obj.release_url;
    });
  }

  open_url(event, url) {
    event.preventDefault();
    if (this._electronService.isElectronApp) {
      this._electronService.shell.openExternal(url);
    } else {
      window.open(url, '_blank');
      console.log('Not an electron app. hence could not launch_window');
    }
  }

}
