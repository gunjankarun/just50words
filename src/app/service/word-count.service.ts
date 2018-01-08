import { Injectable } from '@angular/core';

@Injectable()
export class WordCountService {

  constructor() { }

  get_word_count(text: string) {
    let matches: any;
    matches = text.match(/[\w\d]+/gi);
    // console.log('matches=', matches);
    const word_count = matches ? matches.length : 0;
    return word_count;
  }

}
