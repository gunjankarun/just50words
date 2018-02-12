import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../service/message.service';
import { Message } from '../../message';
/**
 * This component handles all message related services
 * Also this component users MessageService
 *
 * @export
 * @class MessageComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnInit {

  current_message: Message = {
    message: 'Waiting for msg',
    type: 'info',
    msg_date: new Date()
  };

  constructor(private _msgService: MessageService) {
    this.current_message = this._msgService.current_message;
  }

  ngOnInit() {
    this.current_message = this._msgService.current_message;
  }

}
