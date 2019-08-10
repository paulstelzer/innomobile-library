import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'numberCounter'})
export class NumberCounterPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const res = [];
    for (let i = 0; i < value; i++) {
        res.push(i);
      }
      return res;
  }
}
