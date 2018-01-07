import { Injectable } from '@angular/core';
import { Message } from '../message';
@Injectable()
export class MessageService {

  messages: string[] = [];
  show_message = false;
  message_timeout_interval = 5 * 1000;
  message_timeout: any;

  current_message: Message= {
    message: null,
    type: null
  };

  constructor() { }

  add(message: string, type: string = 'warning') {
    console.log('MSG: ', message);
    this.current_message.message = message;
    this.current_message.type = type;
    this.messages.push(message);
    this.show_message = true;

    if (this.message_timeout) {
      clearInterval(this.message_timeout);
    }
    this.message_timeout = setTimeout(() => {
      this.current_message.message = null;
      this.current_message.type = null;
      console.log('Hiding Message');
      this.show_message = false;
    }, this.message_timeout_interval);

  }

  clear() {
    this.messages = [];
  }
}
