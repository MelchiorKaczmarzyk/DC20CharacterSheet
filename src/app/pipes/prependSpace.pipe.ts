import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prependSpace',
  standalone: true
})
export class PrependSpace implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (value == null) return ' ';
    return '' + value;
  }
}