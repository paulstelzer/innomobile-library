import {Pipe, PipeTransform} from '@angular/core'

@Pipe({ name: 'objectValuesComma' })
export class ObjectValuesCommaPipe implements PipeTransform {
  transform(value): any {
    const values = Object.keys(value).map(key => value[key]);
    return values.join(',');
  }
}
