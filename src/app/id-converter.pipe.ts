import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idConverter'
})
export class IdConverterPipe implements PipeTransform {

  transform(value: String, ...args: any[]): any {
    return value.slice(0, 11).concat('...')
  }

}
