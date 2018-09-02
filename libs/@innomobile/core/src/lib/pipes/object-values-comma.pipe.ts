import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'objectValuesComma' })
export class ObjectValuesCommaPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const values = Object.keys(value).map(key => value[key]).map(x => x.substr(0, x.length - 4));
    const commaJoinedValues = values.join(',');
    return commaJoinedValues;
  }
}
