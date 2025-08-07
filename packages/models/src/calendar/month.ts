import { DayID, ICalendarMonth, MonthID } from '@repo/types';
import { dayID, parseMonthID, weekStart } from '@repo/utils';
import { Temporal } from 'temporal-polyfill';

const WEEK_START = weekStart();
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getMonthNames = () => {
  return MONTH_NAMES;
};

const MONTH_GRID_COLS = 7;
const MONTH_GRID_ROWS = 6;
const MONTH_GRID_DAYS = MONTH_GRID_COLS * MONTH_GRID_ROWS;

export class CalendarMonth implements ICalendarMonth {
  readonly id: MonthID;
  readonly unit = 'month';
  readonly yearMonth: Temporal.PlainYearMonth;

  constructor(monthId: MonthID) {
    this.id = monthId;
    const yearMonth = parseMonthID(monthId);

    this.yearMonth = Temporal.PlainYearMonth.from(yearMonth);
  }

  getMonthName(): string {
    const monthIndex = this.yearMonth.month - 1;

    return getMonthNames()[monthIndex] || '?';
  }

  getMonthNameShort(): string {
    return this.getMonthName().slice(0, 3);
  }

  getDaysKeys = (): DayID[] => {
    return Array.from({ length: this.yearMonth.daysInMonth }, (_, day) =>
      dayID(new Temporal.PlainDate(this.yearMonth.year, this.yearMonth.month, day + 1)),
    );
  };

  getFirstWeekShift(): number {
    const firstDayOfMonth = this.yearMonth.toPlainDate({ day: 1 });

    return (firstDayOfMonth.dayOfWeek - WEEK_START + MONTH_GRID_COLS) % MONTH_GRID_COLS;
  }

  getPrevMonthDaysKeys = (): DayID[] => {
    const firstWeekShift = this.getFirstWeekShift();
    const firstDayOfMonth = this.yearMonth.toPlainDate({ day: 1 });
    const firstDayOfWeek = firstDayOfMonth.subtract({ days: firstWeekShift });

    return Array.from({ length: firstWeekShift }, (_, day) => dayID(firstDayOfWeek.add({ days: day })));
  };

  getNextMonthDaysKeys = (): DayID[] => {
    const prevMonthDaysCount = this.getPrevMonthDaysKeys().length;
    const currentMonthDaysCount = this.getDaysKeys().length;
    const nextMonthDaysCount = MONTH_GRID_DAYS - prevMonthDaysCount - currentMonthDaysCount;

    if (nextMonthDaysCount <= 0) {
      return [];
    }

    const lastDayOfMonth = this.yearMonth.toPlainDate({ day: this.yearMonth.daysInMonth });
    const firstDayOfNextMonth = lastDayOfMonth.add({ days: 1 });

    return Array.from({ length: nextMonthDaysCount }, (_, day) => dayID(firstDayOfNextMonth.add({ days: day })));
  };
}
