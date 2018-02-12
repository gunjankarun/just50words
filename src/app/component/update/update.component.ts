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

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  app_version = this._configService.app_version;
  git_username = Constants.git_username;
  git_repo_name = Constants.git_repo_name;
  version_str = 'Current version: ' + this.app_version + ' (Checking for updates)';
  version_url = Constants.product_website;
  update_data = {
    latest_version: '',
    update_title: '',
    update_msg: '',
    release_url: ''
  };
  constructor(
    private _configService: ConfigService,
    private _updateService: UpdateService,
    private _electronService: ElectronService
  ) {}

  ngOnInit() {
    // this.app_version = this._configService.app_version;
    this.check_update();
  }

  check_update() {
    this._updateService.check_release(this.git_username, this.git_repo_name)
      .subscribe(http_data => {

        if (http_data) {
          this.update_data.release_url = http_data.html_url;
          this.update_data.latest_version = http_data.tag_name;
          this.update_data.update_title = '🎉   New version ' + http_data.tag_name + ' is available';
          this.update_data.update_msg = http_data.body;
          // const new_version_str = http_data.tag_name.replace(/v/g, "");
          const arr_curr_version = this.app_version.split('.');
          const arr_new_version = http_data.tag_name.split('.');
          let new_version_available = false;
          if (arr_curr_version.length === 3 && arr_new_version.length === 3) {
            if (parseInt(arr_new_version[0], 10) > parseInt(arr_curr_version[0], 10)) {
              new_version_available = true;
            } else if (parseInt(arr_new_version[1], 10) > parseInt(arr_curr_version[1], 10)) {
              new_version_available = true;
            } else if (parseInt(arr_new_version[2], 10) > parseInt(arr_curr_version[2], 10)) {
              new_version_available = true;
            } else {
              this.update_data.update_title = 'You have the latest version';
            }

            if ( new_version_available ) {
              this.version_str = this.update_data.update_title;
              this.version_url = this.update_data.release_url;

              // Now let us get the version url based on the os.
              const asset_file_ext = this.get_file_extension();
              if (asset_file_ext) {
                console.log('asset_file_ext=', asset_file_ext );
                http_data.assets.forEach(asset => {
                  const dl_url = asset.browser_download_url;
                  console.log('Checking url ' + dl_url);
                  const arr_dl_url = dl_url.split('.');
                  const dl_ext = arr_dl_url[arr_dl_url.length - 1];
                  console.log('Comparing ext = ' + dl_ext + ' with ' +  asset_file_ext);
                  if (dl_ext.toLowerCase() === asset_file_ext) {
                    this.version_url = dl_url;
                    return;
                  }
                });
              }
            }
          }else {
            this.update_data.update_title = 'Could not check updates';
          }
        }
        // console.log('update_data', this.update_data);
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

  get_file_extension(): string {
    const os = process.platform;
    let file_ext = '';
    switch (os) {
      case 'win32':
        file_ext = 'msi';
        break;
      case 'darwin':
        file_ext = 'msi';
        break;
      case 'linux':
        file_ext = 'msi';
        break;
      default:
        file_ext = '';
        break;
    }
    // console.log('OS = ' + os + ' and file_ext = ' + file_ext);
    return file_ext;
  }

}
