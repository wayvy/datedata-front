import { ICalendarEvent, CalendarEventApi } from '@repo/types';
import { utcStringToLocalDateTime } from '@repo/utils';
import { Temporal } from 'temporal-polyfill';

export class CalendarEvent implements ICalendarEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly start: Temporal.PlainDateTime;
  readonly end: Temporal.PlainDateTime;
  readonly allDay: boolean;
  readonly calendarId: string;

  constructor(event: CalendarEventApi) {
    this.id = event.id;
    this.title = event.title;
    this.description = event.description;
    this.start = utcStringToLocalDateTime(event.start_date);
    this.end = utcStringToLocalDateTime(event.end_date);
    this.allDay = event.all_day;
    this.calendarId = event.calendar_id;
  }
}
