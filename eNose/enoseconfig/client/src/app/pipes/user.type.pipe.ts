import { Pipe, PipeTransform } from '@angular/core';
import { UserType } from '../models/type';

@Pipe({
  name: 'userType'
})
export class UserTypePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return UserType[value];
  }

}
