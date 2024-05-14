// src/app/pipes/date-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  private datePipe: DatePipe = new DatePipe('en-US');

  transform(value: string | Date): string | null {
    if (!value) return null;
    return this.datePipe.transform(value, 'dd/MM/yyyy');
  }

}
