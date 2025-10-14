import type { DayID, MonthID } from '@repo/types';
import { dayID, parseMonthID, weekStart } from '@repo/utils';
import { Temporal } from 'temporal-polyfill';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { CalendarMonth } from './month';

vi.mock('@repo/utils', () => ({
  dayID: vi.fn(),
  parseMonthID: vi.fn(),
  weekStart: vi.fn(() => 1),
}));

const mockDayID = vi.mocked(dayID);
const mockParseMonthID = vi.mocked(parseMonthID);
const mockWeekStart = vi.mocked(weekStart);

describe('CalendarMonth', () => {
  const DEFAULT_MONTH_ID = '2025-01' as MonthID;
  const mockYearMonth = new Temporal.PlainYearMonth(2025, 1);

  beforeEach(() => {
    vi.clearAllMocks();
    mockParseMonthID.mockReturnValue(mockYearMonth);
    mockWeekStart.mockReturnValue(1);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create CalendarMonth instance with correct properties', () => {
      const calendarMonth = new CalendarMonth(DEFAULT_MONTH_ID);

      expect(calendarMonth.id).toBe(DEFAULT_MONTH_ID);
      expect(calendarMonth.unit).toBe('month');
      expect(calendarMonth.yearMonth).toStrictEqual(mockYearMonth);
      expect(mockParseMonthID).toHaveBeenCalledTimes(1);
      expect(mockParseMonthID).toHaveBeenCalledWith(DEFAULT_MONTH_ID);
    });
  });

  describe('getMonthName', () => {
    it.each([
      { ym: new Temporal.PlainYearMonth(2025, 1), id: '2025-01' as MonthID, expected: 'January' },
      { ym: new Temporal.PlainYearMonth(2025, 12), id: '2025-12' as MonthID, expected: 'December' },
    ])('should return correct month name for $expected', ({ ym, id, expected }) => {
      mockParseMonthID.mockReturnValue(ym);
      const calendarMonth = new CalendarMonth(id);

      expect(calendarMonth.getMonthName()).toBe(expected);
    });
  });

  describe('getMonthNameShort', () => {
    it('should return first 3 characters of month name', () => {
      const januaryYearMonth = new Temporal.PlainYearMonth(2025, 1);

      mockParseMonthID.mockReturnValue(januaryYearMonth);
      const calendarMonth = new CalendarMonth('2025-01' as MonthID);

      expect(calendarMonth.getMonthNameShort()).toBe('Jan');
    });

    it('should return empty string when month name is missing', () => {
      const marchYearMonth = new Temporal.PlainYearMonth(2025, 3);

      mockParseMonthID.mockReturnValue(marchYearMonth);
      const calendarMonth = new CalendarMonth('2025-03' as MonthID);

      (calendarMonth as any).yearMonth = { month: 20 };

      expect(calendarMonth.getMonthName()).toBe('');
      expect(calendarMonth.getMonthNameShort()).toBe('');
    });
  });

  describe('getDaysKeys', () => {
    it('should return array of day IDs for January (31 days)', () => {
      const januaryYearMonth = new Temporal.PlainYearMonth(2025, 1);

      mockParseMonthID.mockReturnValue(januaryYearMonth);
      const calendarMonth = new CalendarMonth('2025-01' as MonthID);

      const expectedDayIds: DayID[] = [];

      for (let day = 1; day <= 31; day++) {
        const expectedDayId = `2025-01-${day.toString().padStart(2, '0')}` as DayID;

        expectedDayIds.push(expectedDayId);
        mockDayID.mockReturnValueOnce(expectedDayId);
      }

      const result = calendarMonth.getDaysKeys();

      expect(result).toEqual(expectedDayIds);
      expect(mockDayID).toHaveBeenCalledTimes(31);
    });

    it('should return array of day IDs for February (29 days in leap year)', () => {
      const februaryYearMonth = new Temporal.PlainYearMonth(2024, 2);

      mockParseMonthID.mockReturnValue(februaryYearMonth);
      const calendarMonth = new CalendarMonth('2024-02' as MonthID);

      const expectedDayIds: DayID[] = [];

      for (let day = 1; day <= 29; day++) {
        const expectedDayId = `2024-02-${day.toString().padStart(2, '0')}` as DayID;

        expectedDayIds.push(expectedDayId);
        mockDayID.mockReturnValueOnce(expectedDayId);
      }

      const result = calendarMonth.getDaysKeys();

      expect(result).toEqual(expectedDayIds);
      expect(mockDayID).toHaveBeenCalledTimes(29);
    });
  });

  describe('getFirstWeekShift', () => {
    it('should return correct shift for month starting on Monday', () => {
      const septemberYearMonth = new Temporal.PlainYearMonth(2025, 9);

      mockParseMonthID.mockReturnValue(septemberYearMonth);
      mockWeekStart.mockReturnValue(1);
      const calendarMonth = new CalendarMonth('2025-09' as MonthID);

      expect(calendarMonth.getFirstWeekShift()).toBe(0);
    });

    it('should return correct shift for month starting on Sunday', () => {
      const juneYearMonth = new Temporal.PlainYearMonth(2025, 6);

      mockParseMonthID.mockReturnValue(juneYearMonth);
      mockWeekStart.mockReturnValue(1);
      const calendarMonth = new CalendarMonth('2025-06' as MonthID);

      expect(calendarMonth.getFirstWeekShift()).toBe(6);
    });
  });

  describe('getPrevMonthDaysKeys', () => {
    it('should return empty array for month starting on Monday', () => {
      const septemberYearMonth = new Temporal.PlainYearMonth(2025, 9);

      mockParseMonthID.mockReturnValue(septemberYearMonth);
      const calendarMonth = new CalendarMonth('2025-09' as MonthID);

      vi.spyOn(calendarMonth, 'getFirstWeekShift').mockReturnValue(0);

      expect(calendarMonth.getPrevMonthDaysKeys()).toHaveLength(0);
    });

    it('should return previous month days when needed', () => {
      const marchYearMonth = new Temporal.PlainYearMonth(2025, 3);

      mockParseMonthID.mockReturnValue(marchYearMonth);
      const calendarMonth = new CalendarMonth('2025-03' as MonthID);

      vi.spyOn(calendarMonth, 'getFirstWeekShift').mockReturnValue(5);

      expect(calendarMonth.getPrevMonthDaysKeys()).toHaveLength(5);
    });
  });

  describe('getNextMonthDaysKeys', () => {
    it('should return empty array when grid is filled', () => {
      const januaryYearMonth = new Temporal.PlainYearMonth(2025, 1);

      mockParseMonthID.mockReturnValue(januaryYearMonth);
      const calendarMonth = new CalendarMonth('2025-01' as MonthID);

      vi.spyOn(calendarMonth, 'getPrevMonthDaysKeys').mockReturnValue(
        Array.from({ length: 11 }, (_, i) => `2023-12-${(21 + i).toString().padStart(2, '0')}` as DayID),
      );

      vi.spyOn(calendarMonth, 'getDaysKeys').mockReturnValue(
        Array.from({ length: 31 }, (_, i) => `2025-01-${(i + 1).toString().padStart(2, '0')}` as DayID),
      );

      expect(calendarMonth.getNextMonthDaysKeys()).toEqual([]);
    });

    it('should return next month days when needed', () => {
      const februaryYearMonth = new Temporal.PlainYearMonth(2025, 2);

      mockParseMonthID.mockReturnValue(februaryYearMonth);
      const calendarMonth = new CalendarMonth('2025-02' as MonthID);

      vi.spyOn(calendarMonth, 'getPrevMonthDaysKeys').mockReturnValue(
        Array.from({ length: 4 }, (_, i) => `2025-01-${(28 + i + 1).toString().padStart(2, '0')}` as DayID),
      );

      vi.spyOn(calendarMonth, 'getDaysKeys').mockReturnValue(
        Array.from({ length: 29 }, (_, i) => `2025-02-${(i + 1).toString().padStart(2, '0')}` as DayID),
      );

      expect(calendarMonth.getNextMonthDaysKeys()).toHaveLength(9);
    });
  });
});
