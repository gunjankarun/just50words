import { Injectable } from '@angular/core';
import { MessageService } from './message.service';

@Injectable()
export class FileService {

  constructor(private msgService: MessageService) { }

  save(autosave = false) {
    let message = 'File saved';
    if (autosave) {
      message = 'File saved automatically';
    }
    this.msgService.add(message, 'success');
  }

  load() {
    this.msgService.add('File Loaded', 'success');
  }

}
