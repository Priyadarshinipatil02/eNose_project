import { Pipe, PipeTransform } from '@angular/core';
import { EventCriteriaType } from '../models/type';

@Pipe({
  name: 'event_criteria_type'
})
export class EventCriteriaTypePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return EventCriteriaType[value];
  }

}
