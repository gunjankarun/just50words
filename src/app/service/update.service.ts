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
  constructor(
    private _http: HttpClient
  ) {}

  check_release(git_username, git_repo_name): Observable <any> {
    const dt = new Date().getMilliseconds();
    const git_release_url = 'https://api.github.com/repos/' + git_username + '/' + git_repo_name + '/releases/latest?rand=' + dt;
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
}
