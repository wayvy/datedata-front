import type { DayID, WeekID } from '@repo/types';
import { dayID, parseWeekID } from '@repo/utils';
import { Temporal } from 'temporal-polyfill';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { CalendarWeek } from './week';

vi.mock('@repo/utils', () => ({
  dayID: vi.fn(),
  parseWeekID: vi.fn(),
}));

const mockDayID = vi.mocked(dayID);
const mockParseWeekID = vi.mocked(parseWeekID);

describe('CalendarWeek', () => {
  const DEFAULT_WEEK_ID = '2025-01-13' as WeekID;
  const mockFirstDate = new Temporal.PlainDate(2025, 1, 13);

  beforeEach(() => {
    vi.clearAllMocks();
    mockParseWeekID.mockReturnValue(mockFirstDate);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create CalendarWeek instance with correct properties', () => {
      const calendarWeek = new CalendarWeek(DEFAULT_WEEK_ID);

      expect(calendarWeek.id).toBe(DEFAULT_WEEK_ID);
      expect(calendarWeek.unit).toBe('week');
      expect(calendarWeek.firstDate).toBe(mockFirstDate);
      expect(mockParseWeekID).toHaveBeenCalledTimes(1);
      expect(mockParseWeekID).toHaveBeenCalledWith(DEFAULT_WEEK_ID);
    });
  });

  describe('getDaysIds', () => {
    it('should return array of 7 day IDs', () => {
      const mondayDate = new Temporal.PlainDate(2025, 1, 13);

      mockParseWeekID.mockReturnValue(mondayDate);
      const calendarWeek = new CalendarWeek('2025-01-13' as WeekID);

      const expectedDayIds: DayID[] = [];

      for (let day = 0; day < 7; day++) {
        const expectedDayId = `2025-01-${(13 + day).toString().padStart(2, '0')}` as DayID;

        expectedDayIds.push(expectedDayId);
        mockDayID.mockReturnValueOnce(expectedDayId);
      }

      const result = calendarWeek.getDaysIds();

      expect(result).toEqual(expectedDayIds);
      expect(mockDayID).toHaveBeenCalledTimes(7);
      expect(mockDayID).toHaveBeenCalledWith(mondayDate.add({ days: 0 }));
      expect(mockDayID).toHaveBeenCalledWith(mondayDate.add({ days: 6 }));
    });

    it('should handle week crossing month boundary', () => {
      const lastWeekOfMonthDate = new Temporal.PlainDate(2025, 1, 29);

      mockParseWeekID.mockReturnValue(lastWeekOfMonthDate);
      const calendarWeek = new CalendarWeek('2025-01-29' as WeekID);

      const expectedDayIds: DayID[] = [];
      const expectedDates = [
        '2025-01-29',
        '2025-01-30',
        '2025-01-31',
        '2025-02-01',
        '2025-02-02',
        '2025-02-03',
        '2025-02-04',
      ];

      for (let day = 0; day < 7; day++) {
        const expectedDayId = expectedDates[day] as DayID;

        expectedDayIds.push(expectedDayId);
        mockDayID.mockReturnValueOnce(expectedDayId);
      }

      const result = calendarWeek.getDaysIds();

      expect(result).toEqual(expectedDayIds);
      expect(mockDayID).toHaveBeenCalledTimes(7);
    });
  });
});
