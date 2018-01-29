import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Just 60 Words';
  innerHeight: number;
  listHeight: number;
  editorHeight: number;

  constructor() {
    this.set_screen();
  }

  /**
  * Function to track screen resize event
  * @param {any} event
  * @memberof AppComponent
  */
  onResize(event) {
    // console.log('Screen Resized:', event.target.innerHeight);
    this.set_screen();
  }


  /**
   * Set's screen's height to handle resize events
   *
   * @memberof AppComponent
   */
  set_screen() {
    this.innerHeight = (window.innerHeight);
    this.listHeight = this.innerHeight - (63 + 54);
    this.editorHeight = this.innerHeight - (157);
  }

}
