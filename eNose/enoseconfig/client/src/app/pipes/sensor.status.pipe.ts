import { Pipe, PipeTransform } from '@angular/core';
const SensorStatus = {
    3: "green",
    2: "red",
    1: "gray"
} as any
@Pipe({
  name: 'sensor_status'
})
export class SensorStatusPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return SensorStatus[value];
  }

}
