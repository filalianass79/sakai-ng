import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ouiNon'
})
export class OuiNonPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value ? 'Oui' : "Non";
   // [ngClass]="{'true-icon pi-check-circle': (_cell(rowData, col.field)), 'false-icon pi-times-circle': !(_cell(rowData, col.field))}"
  }
}
