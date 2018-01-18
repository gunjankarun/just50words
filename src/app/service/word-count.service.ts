import { Injectable } from '@angular/core';

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
    // console.log('matches=', matches);
    const word_count = matches ? matches.length : 0;
    return word_count;
  }

}
