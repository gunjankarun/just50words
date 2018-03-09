import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

/**
 * This class will check https://api.github.com/repos/gunjankarun/just50words/releases/latest for the latest release version
 * and then send the message to user about when a new update is available and also the download url
 *
 * @export
 * @class UpdateService
 */
@Injectable()
export class UpdateService {
  update_data = {
    new_version_available: false,
    latest_version: '',
    title: '',
    msg: '',
    release_url: ''
  };

  constructor(private _http: HttpClient) {}

  check_update(app_version, git_username, git_repo_name, next) {
    this.check_release(git_username, git_repo_name).subscribe(http_data => {
      if (http_data) {
        // console.log('100 ', http_data);
        this.update_data.release_url = http_data.html_url;
        this.update_data.latest_version = http_data.tag_name;
        this.update_data.title =
          '🎉   New version ' + http_data.tag_name + ' is available';
        this.update_data.msg = http_data.body.replace(/\n/g, '<br>');

        const arr_curr_version = app_version.split('.');
        const arr_new_version = http_data.tag_name.split('.');
        let new_version_available = false;
        if (arr_curr_version.length === 3 && arr_new_version.length === 3) {
          if (
            parseInt(arr_new_version[0], 10) > parseInt(arr_curr_version[0], 10)
          ) {
            new_version_available = true;
          } else if (
            parseInt(arr_new_version[1], 10) > parseInt(arr_curr_version[1], 10)
          ) {
            new_version_available = true;
          } else if (
            parseInt(arr_new_version[2], 10) > parseInt(arr_curr_version[2], 10)
          ) {
            new_version_available = true;
          } else {
            this.update_data.title = 'You have the latest version';
          }

          if (new_version_available) {
            // console.log('200 New Version Available');
            this.update_data.new_version_available = true;

            // Now let us get the version url based on the os.
            const asset_file_ext = this._get_file_extension();
            if (asset_file_ext) {
              console.log('asset_file_ext=', asset_file_ext);
              http_data.assets.forEach(asset => {
                const dl_url = asset.browser_download_url;
                console.log('Checking url ' + dl_url);
                const arr_dl_url = dl_url.split('.');
                const dl_ext = arr_dl_url[arr_dl_url.length - 1];
                console.log(
                  'Comparing ext = ' + dl_ext + ' with ' + asset_file_ext
                );
                if (dl_ext.toLowerCase() === asset_file_ext) {
                  this.update_data.release_url = dl_url;
                  return next(null, this.update_data);
                }
              });
            }
          } else {
            this.update_data.title = 'You have the latest version';
            return next(null, this.update_data);
          }
        } else {
          this.update_data.title = 'Could not check updates';
          return next(null, this.update_data);
        }
      }
      // console.log('update_data', this.update_data);
    });
  }

  check_release(git_username, git_repo_name): Observable<any> {
    const dt = new Date().getMilliseconds();
    const git_release_url =
      'https://api.github.com/repos/' +
      git_username +
      '/' +
      git_repo_name +
      '/releases/latest?rand=' +
      dt;
    console.log('Checking update from URL', git_release_url);
    return this._http.get<any>(git_release_url).pipe(
      tap(update_data => {
        // console.log(`fetched update_data`, update_data);
      }),
      catchError(this.handleError('check_release', []))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private _get_file_extension(): string {
    const os = process.platform;
    let file_ext = '';
    switch (os) {
      case 'win32':
        file_ext = 'msi';
        break;
      case 'darwin':
        file_ext = 'dmg';
        break;
      case 'linux':
        file_ext = 'deb';
        break;
      default:
        file_ext = '';
        break;
    }
    // console.log('OS = ' + os + ' and file_ext = ' + file_ext);
    return file_ext;
  }
}
