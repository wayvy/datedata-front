import { HourID, ICalendarHour } from '@repo/types';
import { parseHourID } from '@repo/utils';
import { Temporal } from 'temporal-polyfill';

export class CalendarHour implements ICalendarHour {
  readonly id: HourID;
  readonly unit = 'hour';
  readonly dateTime: Temporal.PlainDateTime;

  constructor(hourId: HourID) {
    this.id = hourId;
    this.dateTime = parseHourID(hourId);
  }

  toString() {
    return `${this.dateTime.hour}:00`;
  }
}
