import { Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
 } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { Constants } from '../../constants';
import { UpdateService } from '../../service/update.service';
import { ElectronService } from 'ngx-electron';
import { NgbModal, NgbPopover, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit, AfterViewInit {
  @ViewChild('p') public popover: NgbPopover;
  app_version = this._configService.app_version;
  git_username = Constants.GIT_USERNAME;
  git_repo_name = Constants.GIT_REPO_NAME;
  version_str = ' v: ' + this.app_version + ' (Checking for updates)';
  version_url = Constants.PRODUCT_WEBSITE;
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
    this.check_update();
  }

  ngAfterViewInit() {
    // this.app_version = this._configService.app_version;
    // this.check_update();
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

  show_new_version_info(e) {
    e.preventDefault();
    this.popover.open();
  }

  check_update() {
    const scope = this;
    this._updateService.check_update(
      this.app_version,
      this.git_username,
      this.git_repo_name,
      function(err, update_obj) {
        if (update_obj.new_version_available) {
          scope.version_str = 'Found new version ' + update_obj.latest_version + ' ';
          scope.version_url = update_obj.release_url;
        }else {
          scope.version_str = 'You have the latest version';
          // scope.version_url = update_obj.release_url;
        }
        scope.update_data = update_obj;
      }
    );
  }

  open_url(event, url) {
    event.preventDefault();
    if (this._electronService.isElectronApp) {
      this._electronService.shell.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  }
}
