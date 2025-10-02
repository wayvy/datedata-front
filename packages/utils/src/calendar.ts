import { DayID, HourID, MonthID, WeekID, YearID } from '@repo/types';
import { Temporal } from 'temporal-polyfill';

import { leadingZero } from './leading-zero';

export const hourID = (dateTime: Temporal.PlainDateTime): HourID => {
  return `${dateTime.year}_${leadingZero(dateTime.month)}_${leadingZero(dateTime.day)}_${leadingZero(dateTime.hour)}`;
};

export const parseHourID = (hourId: HourID): Temporal.PlainDateTime => {
  const [year, month, day, hour] = hourId.split('_');

  return new Temporal.PlainDateTime(parseInt(year), parseInt(month), parseInt(day), parseInt(hour));
};

export const dayID = (date: Temporal.PlainDate): DayID => {
  return `${date.year}_${leadingZero(date.month)}_${leadingZero(date.day)}`;
};

export const parseDayID = (dayId: DayID): Temporal.PlainDate => {
  const [year, month, day] = dayId.split('_');

  return new Temporal.PlainDate(parseInt(year), parseInt(month), parseInt(day));
};

export const weekID = (dateInWeek: Temporal.PlainDate): WeekID => {
  const dayOfWeek = dateInWeek.dayOfWeek;
  // 1:monday, 7:sunday
  const firstDateOfWeek = dateInWeek.subtract({ days: dayOfWeek - 1 });

  return dayID(firstDateOfWeek);
};

export const parseWeekID = (weekId: WeekID): Temporal.PlainDate => {
  const [year, month, day] = weekId.split('_');

  return new Temporal.PlainDate(parseInt(year), parseInt(month), parseInt(day));
};

export const monthID = (yearMonth: Temporal.PlainYearMonth): MonthID => {
  return `${yearMonth.year}_${leadingZero(yearMonth.month)}`;
};

export const parseMonthID = (monthId: MonthID): Temporal.PlainYearMonth => {
  const [year, month] = monthId.split('_');

  return new Temporal.PlainYearMonth(parseInt(year), parseInt(month));
};

export const yearID = (year: string | number): YearID => {
  return typeof year === 'string' ? year : String(year);
};

export const parseYearID = (yearId: YearID): number => {
  return parseInt(yearId);
};

export const getPlainDateIds = (date: Temporal.PlainDate): [YearID, MonthID, DayID] => {
  const year = date.year;
  const month = Temporal.PlainYearMonth.from(date);
  const day = Temporal.PlainDate.from(date);

  return [yearID(year), monthID(month), dayID(day)];
};
