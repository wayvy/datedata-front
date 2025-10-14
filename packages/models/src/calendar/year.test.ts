import type { MonthID, YearID } from '@repo/types';
import { monthID, parseYearID } from '@repo/utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { CalendarMonth } from './month';
import { CalendarYear } from './year';

vi.mock('@repo/utils', () => ({
  monthID: vi.fn(),
  parseYearID: vi.fn(),
}));

vi.mock('./month', () => ({
  CalendarMonth: vi.fn(),
}));

const mockMonthID = vi.mocked(monthID);
const mockParseYearID = vi.mocked(parseYearID);
const MockCalendarMonth = vi.mocked(CalendarMonth);

describe('CalendarYear', () => {
  const DEFAULT_YEAR_ID = '2025' as YearID;
  const mockYear = 2025;

  const generateMonthId = (month: number): MonthID => `2025-${month.toString().padStart(2, '0')}` as MonthID;

  const setupMocksForConstructor = () => {
    for (let month = 1; month <= 12; month++) {
      const monthId = generateMonthId(month);

      mockMonthID.mockReturnValueOnce(monthId);
      MockCalendarMonth.mockImplementationOnce(() => ({ id: monthId, unit: 'month' }) as CalendarMonth);
    }
  };

  const setupMocksForMethods = () => {
    for (let month = 1; month <= 12; month++) {
      mockMonthID.mockReturnValueOnce(generateMonthId(month));
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockParseYearID.mockReturnValue(mockYear);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create CalendarYear instance with correct properties', () => {
      setupMocksForConstructor();

      const calendarYear = new CalendarYear(DEFAULT_YEAR_ID);

      expect(calendarYear.id).toBe(DEFAULT_YEAR_ID);
      expect(calendarYear.unit).toBe('year');
      expect(calendarYear.months).toHaveLength(12);
      expect(mockParseYearID).toHaveBeenCalledTimes(12);
      expect(MockCalendarMonth).toHaveBeenCalledTimes(12);
      expect(mockMonthID).toHaveBeenCalledTimes(12);
    });
  });

  describe('getMonthsKeys', () => {
    it('should return array of 12 month IDs', () => {
      setupMocksForConstructor();
      setupMocksForMethods();

      const calendarYear = new CalendarYear(DEFAULT_YEAR_ID);

      const expectedMonthIds = Array.from({ length: 12 }, (_, i) => generateMonthId(i + 1));

      const result = calendarYear.getMonthsKeys();

      expect(result).toEqual(expectedMonthIds);
    });
  });

  describe('getMonths', () => {
    it('should return array of 12 CalendarMonth instances', () => {
      setupMocksForConstructor();
      setupMocksForMethods();

      const calendarYear = new CalendarYear(DEFAULT_YEAR_ID);

      const result = calendarYear.getMonths();

      expect(result).toHaveLength(12);
    });
  });
});
