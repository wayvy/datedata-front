import { DateTime } from '@gravity-ui/date-utils';

export type EventFormFieldValues<T = DateTime> = {
  startDate: T;
  endDate: T;
  title: string;
  description: string;
  allDay: boolean;
  calendarId: string;
};
