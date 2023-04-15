import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'confirmationStatus'
})
export class ConfirmationStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value === 'boolean') //
      return value ? 'Credenciado' : 'Não credenciado';

    return value;
  }

}
