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
        console.log('100 ', http_data);
        this.update_data.release_url = http_data.html_url;
        this.update_data.latest_version = http_data.tag_name;
        this.update_data.title = http_data.name;
        this.update_data.msg = http_data.body.replace(/\n/g, '<br>');
        console.log('200 update_data', this.update_data);

        const arr_curr_version = app_version.split('.');
        const arr_new_version = http_data.tag_name.split('.');
        if (arr_curr_version.length === 3 && arr_new_version.length === 3) {
          console.log(
          'Comparing ' + parseInt(arr_new_version[0], 10) + ' > ' + parseInt(arr_curr_version[0], 10) );
          const new_version = this.versionCompare(http_data.tag_name, app_version);
          if (new_version > 0) {
            // console.log('200 New Version Available');
            // this.update_data.title = '🎉   New version ' + http_data.tag_name + ' is available';
            this.update_data.new_version_available = true;

            // Now let us get the version url based on the os.
            const asset_file_ext = this._get_file_extension();
            if (asset_file_ext) {
              // console.log('asset_file_ext=', asset_file_ext);
              http_data.assets.forEach(asset => {
                const dl_url = asset.browser_download_url;
                console.log('Checking url ' + dl_url);
                const arr_dl_url = dl_url.split('.');
                const dl_ext = arr_dl_url[arr_dl_url.length - 1];
                // console.log('Comparing ext = ' + dl_ext + ' with ' + asset_file_ext);
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
        console.log(`fetched update_data`, update_data);
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
        file_ext = 'dmg';
        break;
    }
    console.log('OS = ' + os + ' and file_ext = ' + file_ext);
    return file_ext;
  }

  /**
   * Compares two software version numbers (e.g. "1.7.1" or "1.2b").
   *
   * This function was born in http://stackoverflow.com/a/6832721.
   *
   * @param {string} v1 The first version to be compared.
   * @param {string} v2 The second version to be compared.
   * @param {object} [options] Optional flags that affect comparison behavior:
   * <ul>
   *     <li>
   *         <tt>lexicographical: true</tt> compares each part of the version strings lexicographically instead of
   *         naturally; this allows suffixes such as "b" or "dev" but will cause "1.10" to be considered smaller than
   *         "1.2".
   *     </li>
   *     <li>
   *         <tt>zeroExtend: true</tt> changes the result if one version string has less parts than the other. In
   *         this case the shorter string will be padded with "zero" parts instead of being considered smaller.
   *     </li>
   * </ul>
   * @returns {number|NaN}
   * <ul>
   *    <li>0 if the versions are equal</li>
   *    <li>a negative integer iff v1 < v2</li>
   *    <li>a positive integer iff v1 > v2</li>
   *    <li>NaN if either version string is in the wrong format</li>
   * </ul>
   *
   * @copyright by Jon Papaioannou (["john", "papaioannou"].join(".") + "@gmail.com")
   * @license This function is in the public domain. Do what you want with it, no strings attached.
   */
  private versionCompare(v1, v2, options = null) {
    const lexicographical = options && options.lexicographical,
      zeroExtend = options && options.zeroExtend;
    let v1parts = v1.split('.'),
      v2parts = v2.split('.');

    function isValidPart(x) {
      return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
      return NaN;
    }

    if (zeroExtend) {
      while (v1parts.length < v2parts.length) {
        v1parts.push('0');
      }
      while (v2parts.length < v1parts.length) {
        v2parts.push('0');
      }
    }

    if (!lexicographical) {
      v1parts = v1parts.map(Number);
      v2parts = v2parts.map(Number);
    }

    for (let i = 0; i < v1parts.length; ++i) {
      if (v2parts.length === i) {
        return 1;
      }

      if (v1parts[i] === v2parts[i]) {
        continue;
      } else if (v1parts[i] > v2parts[i]) {
        return 1;
      } else {
        return -1;
      }
    }

    if (v1parts.length !== v2parts.length) {
      return -1;
    }

    return 0;
  }
}
