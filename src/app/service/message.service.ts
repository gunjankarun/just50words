import { Injectable } from '@angular/core';
import { Message } from '../message';
@Injectable()
export class MessageService {

  messages: string[] = [];
  current_message: Message= {
    message: null,
    type: null
  };

  constructor() { }

  add(message: string, type: string = 'warning') {
    this.current_message.message = message;
    this.current_message.type = type;
    this.messages.push(message);
    console.log('MSG: ', message);
  }

  clear() {
    this.messages = [];
  }
}
