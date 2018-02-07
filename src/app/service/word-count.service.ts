import { Injectable } from '@angular/core';

/**
 * This Service handles the task related to counting words
 * 
 * @export
 * @class WordCountService
 */
@Injectable()
export class WordCountService {
  celebrate = false;
  word_count = 0;

  constructor() { }

  get_word_count(text: string) {
    if (!text) {
      return 0;
    }
    let matches: any;
    matches = text.trim().match(/[\w\d]+/gi);
    const word_count = matches ? matches.length : 0;
    return word_count;
  }

}
