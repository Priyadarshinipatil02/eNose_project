import { Pipe, PipeTransform } from '@angular/core';
import { SensorStatus } from '../models/type';

@Pipe({
  name: 'sensor_status_name'
})
export class SensorStatusNamePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return SensorStatus[value];
  }

}
