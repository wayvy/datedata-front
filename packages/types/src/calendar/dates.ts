import { Temporal } from 'temporal-polyfill';

export type HourID = string; // YYYY-MM-DDTHH
export type DayID = string; // YYYY-MM-DD
export type WeekID = string; // YYYY-MM-DD
export type MonthID = string; // YYYY-MM
export type YearID = string; // YYYY

export interface ICalendarHour {
  readonly id: HourID;
  readonly unit: 'hour';
  readonly dateTime: Temporal.PlainDateTime;
}

export interface ICalendarDay {
  readonly id: DayID;
  readonly unit: 'day';
  readonly date: Temporal.PlainDate;
  readonly getDayOfWeekName: () => string;
}

export interface ICalendarWeek {
  readonly id: WeekID;
  readonly unit: 'week';
  readonly firstDate: Temporal.PlainDate;
  readonly getDaysIds: () => DayID[];
}

export interface ICalendarMonth {
  readonly id: MonthID;
  readonly unit: 'month';
  readonly yearMonth: Temporal.PlainYearMonth;
  readonly getDaysKeys: () => DayID[];
  readonly getPrevMonthDaysKeys: () => DayID[];
  readonly getNextMonthDaysKeys: () => DayID[];
  readonly getMonthName: () => string;
  readonly getMonthNameShort: () => string;
  readonly getFirstWeekShift: () => number;
}

export type ICalendarYear = {
  readonly id: YearID;
  readonly unit: 'year';
  months: ICalendarMonth[];
  readonly getMonthsKeys: () => MonthID[];
  readonly getMonths: () => ICalendarMonth[];
};
