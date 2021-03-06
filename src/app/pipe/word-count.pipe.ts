import { Pipe, PipeTransform } from '@angular/core';
import { WordCountService } from '../service/word-count.service';
/**
 * This pipe displays wordcount of any string passed to it
 *
 * @export
 * @class WordCountPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'wordCount'
})


export class WordCountPipe implements PipeTransform {

  constructor(
    private wordCountService: WordCountService) { }

  transform(text: any, args?: any): any {
    const word_count = this.wordCountService.get_word_count(text);
    return word_count;
  }

}
