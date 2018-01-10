import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../service/message.service';
import { Message } from '../../message';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  current_message: Message = {
    message: 'Waiting for msg',
    type: 'info'
  };

  constructor(private _msgService: MessageService) { }

  ngOnInit() {
    this.current_message = this._msgService.current_message;
  }

}
