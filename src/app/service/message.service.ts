import { Injectable } from '@angular/core';
import { Message } from '../message';
import { ConfigService } from './config.service';

/**
 * This service handles the task of displaying messages across the application
 *
 * @export
 * @class MessageService
 */
@Injectable()
export class MessageService {
  messages: string[] = [];
  show_message = false;
  message_timeout_interval = this._configService.getConfig(
    'message_dismiss_after'
  ) * 1000;
  message_timeout: any;
  config_subscription: any;

  current_message: Message = {
    message: null,
    type: null,
    msg_date: new Date()
  };

  // constructor(private _configService: ConfigService) {}

  constructor(private _configService: ConfigService) {

    // this.config_subscription = this._configService.cast.subscribe(
    //   new_config => {
    //     console.log('Inside msgService  ', new_config);
    //   }
    // );
  }

  add(message: string, type: string = 'warning') {
    this.current_message.message = message;
    this.current_message.type = type;
    this.current_message.msg_date = new Date();
    this.messages.push(message);
    this.show_message = true;

    // Uncomment this to show system notification. Can get annoying if notifications are large
    // const myNotification = new Notification('Just 50 Words', {
    //   body: message
    // });

    if (this.message_timeout) {
      clearInterval(this.message_timeout);
    }
    this.message_timeout = setTimeout(() => {
      this.current_message.message = null;
      this.current_message.type = null;
      this.show_message = false;
    }, this.message_timeout_interval);
  }

  clear() {
    this.messages = [];
  }
}
