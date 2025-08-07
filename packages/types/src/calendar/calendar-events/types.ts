import { Temporal } from 'temporal-polyfill';

export type CalendarEventApi = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  calendar_id: string;
  // share?: {
  //   author: {
  //     id: string;
  //   };
  //   id: string;
  // };
};

export interface ICalendarEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly start: Temporal.PlainDateTime;
  readonly end: Temporal.PlainDateTime;
  readonly allDay: boolean;
  readonly calendarId: string;
}
