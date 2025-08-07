import { DayID, HourID, ICalendarDay } from '@repo/types';
import { hourID, parseDayID } from '@repo/utils';
import { Temporal } from 'temporal-polyfill';

const DAY_OF_WEEK_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export class CalendarDay implements ICalendarDay {
  readonly id: DayID;
  readonly unit = 'day';
  readonly date: Temporal.PlainDate;

  constructor(id: DayID) {
    this.id = id;
    this.date = parseDayID(id);
  }

  getHoursKeys = (): HourID[] => {
    return Array.from({ length: 24 }, (_, hour) =>
      hourID(new Temporal.PlainDateTime(this.date.year, this.date.month, this.date.day, hour)),
    );
  };

  getDayOfWeekName = (): string => {
    return DAY_OF_WEEK_NAMES[this.date.dayOfWeek - 1];
  };
}
