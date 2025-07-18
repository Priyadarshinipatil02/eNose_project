import { Pipe, PipeTransform } from '@angular/core';
import { UserStatus } from '../models/type';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return UserStatus[value];
  }

}
