import { Pipe, PipeTransform } from '@angular/core';
/**
 * This pipe handles tasks related to filtering articles based on selected criteria
 *
 * @export
 * @class FilterArticlesPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'filterArticles'
})

export class FilterArticlesPipe implements PipeTransform {

  transform(items: any[], filter_str: string): any {
    if (!items || !filter_str) {
      return items;
    }
    console.log('Filtering Article');

    filter_str = filter_str.toLowerCase();

    const filtered_list = items.filter(function (item) {
      let found = false;
      found = item.title.toLowerCase().indexOf(filter_str) !== -1;
      if (!found) {
        if (item.content) {
          found = item.content.toLowerCase().indexOf(filter_str) !== -1;
        }
      }
      return found;
    });

    return filtered_list;
  }
}
