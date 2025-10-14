import type { HourID } from '@repo/types';
import { parseHourID } from '@repo/utils';
import { Temporal } from 'temporal-polyfill';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { CalendarHour } from './hour';

vi.mock('@repo/utils', () => ({
  parseHourID: vi.fn(),
}));

const mockParseHourID = vi.mocked(parseHourID);

describe('CalendarHour', () => {
  const DEFAULT_HOUR_ID = '2025-01-15T10:00:00' as HourID;
  const mockDateTime = new Temporal.PlainDateTime(2025, 1, 15, 10, 0, 0);

  beforeEach(() => {
    vi.clearAllMocks();
    mockParseHourID.mockReturnValue(mockDateTime);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create CalendarHour instance with correct properties', () => {
      const calendarHour = new CalendarHour(DEFAULT_HOUR_ID);

      expect(calendarHour.id).toBe(DEFAULT_HOUR_ID);
      expect(calendarHour.unit).toBe('hour');
      expect(calendarHour.dateTime).toBe(mockDateTime);
      expect(mockParseHourID).toHaveBeenCalledTimes(1);
      expect(mockParseHourID).toHaveBeenCalledWith(DEFAULT_HOUR_ID);
    });
  });

  describe('toString', () => {
    it.each([
      { dt: new Temporal.PlainDateTime(2025, 1, 15, 0, 0, 0), id: '2025-01-15T00:00:00' as HourID, expected: '0:00' },
      { dt: new Temporal.PlainDateTime(2025, 1, 15, 23, 0, 0), id: '2025-01-15T23:00:00' as HourID, expected: '23:00' },
    ])('should return correct string format for $expected', ({ dt, id, expected }) => {
      mockParseHourID.mockReturnValue(dt);
      const calendarHour = new CalendarHour(id);

      expect(calendarHour.toString()).toBe(expected);
    });
  });
});
