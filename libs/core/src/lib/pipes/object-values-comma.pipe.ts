import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'objectValuesComma' })
export class ObjectValuesCommaPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const values = Object.keys(value).map(key => value[key]);
    const commaJoinedValues = values.join(',');
    return commaJoinedValues;
  }
}
