import { DayID, ICalendarWeek, WeekID } from '@repo/types';
import { dayID, parseWeekID } from '@repo/utils';
import { Temporal } from 'temporal-polyfill';

export class CalendarWeek implements ICalendarWeek {
  readonly id: WeekID;
  readonly unit = 'week' as const;
  readonly firstDate: Temporal.PlainDate;

  constructor(id: WeekID) {
    this.id = id;
    this.firstDate = parseWeekID(id);
  }

  getDaysIds = (): DayID[] => {
    return Array.from({ length: 7 }, (_, day) => dayID(this.firstDate.add({ days: day })));
  };
}
