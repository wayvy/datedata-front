import type { DayID, HourID } from '@repo/types';
import { hourID, parseDayID } from '@repo/utils';
import { Temporal } from 'temporal-polyfill';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { CalendarDay } from './day';

vi.mock('@repo/utils', () => ({
  hourID: vi.fn(),
  parseDayID: vi.fn(),
}));

const mockHourID = vi.mocked(hourID);
const mockParseDayID = vi.mocked(parseDayID);

describe('CalendarDay', () => {
  const DEFAULT_DAY_ID = '2025-01-15' as DayID;
  const mockDate = new Temporal.PlainDate(2025, 1, 15);

  beforeEach(() => {
    vi.clearAllMocks();
    mockParseDayID.mockReturnValue(mockDate);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create CalendarDay instance with correct properties', () => {
      const calendarDay = new CalendarDay(DEFAULT_DAY_ID);

      expect(calendarDay.id).toBe(DEFAULT_DAY_ID);
      expect(calendarDay.unit).toBe('day');
      expect(calendarDay.date).toBe(mockDate);
      expect(mockParseDayID).toHaveBeenCalledTimes(1);
      expect(mockParseDayID).toHaveBeenCalledWith(DEFAULT_DAY_ID);
    });
  });

  describe('getHoursKeys', () => {
    it('should return array of 24 hour IDs for the day', () => {
      const calendarDay = new CalendarDay(DEFAULT_DAY_ID);
      const expectedHourIds: HourID[] = [];

      for (let hour = 0; hour < 24; hour++) {
        const expectedHourId = `2025-01-15T${hour.toString().padStart(2, '0')}:00:00` as HourID;

        expectedHourIds.push(expectedHourId);
        mockHourID.mockReturnValueOnce(expectedHourId);
      }

      const result = calendarDay.getHoursKeys();

      expect(result).toEqual(expectedHourIds);
      expect(mockHourID).toHaveBeenCalledTimes(24);
      expect(mockHourID).toHaveBeenCalledWith(new Temporal.PlainDateTime(2025, 1, 15, 0));
      expect(mockHourID).toHaveBeenCalledWith(new Temporal.PlainDateTime(2025, 1, 15, 23));
    });
  });

  describe('getDayOfWeekName', () => {
    it.each([
      { date: new Temporal.PlainDate(2025, 1, 15), id: '2025-01-15' as DayID, expected: 'Wednesday' },
      { date: new Temporal.PlainDate(2025, 1, 17), id: '2025-01-17' as DayID, expected: 'Friday' },
    ])('should return correct day name for $expected', ({ date, id, expected }) => {
      mockParseDayID.mockReturnValue(date);
      const calendarDay = new CalendarDay(id);

      expect(calendarDay.getDayOfWeekName()).toBe(expected);
    });
  });
});
