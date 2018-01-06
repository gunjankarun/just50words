import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArticles'
})
export class FilterArticlesPipe implements PipeTransform {

  transform(items: any[], filter_str: string): any {
    if (!items || !filter_str) {
      return items;
    }
    console.log('Filtering Article');

    // const criteria = { title: filter, content: filter };
    // return items.filter(function (obj) {
    //   return Object.keys(criteria).every(function (c) {
    //     return obj[c].indexOf(criteria[c]) !== -1;
    //   });
    // });
    filter_str = filter_str.toLowerCase();

    let filtered_list = items.filter(function (item) {
      let found = false;
      found = item.title.toLowerCase().indexOf(filter_str) !== -1;
      if (!found) {
        found = item.content.toLowerCase().indexOf(filter_str) !== -1;
      }
      return found;
    });

    // console.log('Filtered List', filtered_list);
    return filtered_list;
  }
}
