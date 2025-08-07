import { ICalendarYear, MonthID, YearID } from '@repo/types';
import { monthID, parseYearID } from '@repo/utils';
import { Temporal } from 'temporal-polyfill';

import { CalendarMonth } from './month';

export class CalendarYear implements ICalendarYear {
  readonly id: YearID;
  readonly unit = 'year' as const;
  months: CalendarMonth[] = [];

  constructor(yearId: YearID) {
    this.id = yearId;
    this.months = this.getMonths();
  }

  getMonthsKeys = (): MonthID[] => {
    return Array.from({ length: 12 }, (_, month) => {
      const yearMonth = new Temporal.PlainYearMonth(parseYearID(this.id), month + 1);

      return monthID(yearMonth);
    });
  };

  getMonths = (): CalendarMonth[] => {
    return this.getMonthsKeys().map((monthId) => new CalendarMonth(monthId));
  };
}
