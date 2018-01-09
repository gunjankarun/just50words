import { Component, OnInit, Input } from '@angular/core';
import { WritingStreakService } from '../../service/writing-streak.service';

@Component({
  selector: 'app-writing-streak',
  templateUrl: './writing-streak.component.html',
  styleUrls: ['./writing-streak.component.css']
})
export class WritingStreakComponent implements OnInit {
  @Input() show_list: boolean;
  streak_data: any;

  constructor(
    private _writingStreakService: WritingStreakService
  ) {

  }

  ngOnInit() {
    this._writingStreakService.prepare_streak_data();
    this.streak_data = this._writingStreakService.streaks;
  }

}
