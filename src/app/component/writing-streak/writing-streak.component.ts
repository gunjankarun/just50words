import { Component, OnInit, Input } from '@angular/core';
import { WritingStreakService } from '../../service/writing-streak.service';

@Component({
  selector: 'app-writing-streak',
  templateUrl: './writing-streak.component.html',
  styleUrls: ['./writing-streak.component.css']
})
export class WritingStreakComponent implements OnInit {
  @Input() show_list: boolean;
  streaks: any;

  constructor(
    private _writingStreakService: WritingStreakService
  ) {

  }

  ngOnInit() {
    const scope = this;
    this._writingStreakService.prepare_streak_data(10, function(err, streaks){
      scope.streaks = streaks;
    });
  }

}
