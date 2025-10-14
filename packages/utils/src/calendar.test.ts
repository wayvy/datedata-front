import { Temporal } from 'temporal-polyfill';
import { describe, it, expect } from 'vitest';

import {
  hourID,
  parseHourID,
  dayID,
  parseDayID,
  weekID,
  parseWeekID,
  monthID,
  parseMonthID,
  yearID,
  parseYearID,
  getPlainDateIds,
} from './calendar';

describe('calendar', () => {
  describe('hourID', () => {
    it('should generate correct hour IDs for various cases', () => {
      const testCases = [
        {
          input: new Temporal.PlainDateTime(2025, 1, 5, 9),
          expected: '2025_01_05_09',
          description: 'hourID single digit values',
        },
        {
          input: new Temporal.PlainDateTime(2025, 12, 25, 23),
          expected: '2025_12_25_23',
          description: 'hourID double digit values',
        },
        {
          input: new Temporal.PlainDateTime(2000, 1, 1, 0),
          expected: '2000_01_01_0',
          description: 'leading zero hour',
        },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(hourID(input)).toBe(expected);
      });
    });
  });

  describe('dayID', () => {
    it('should generate correct day IDs for various cases', () => {
      const testCases = [
        { input: new Temporal.PlainDate(2025, 1, 5), expected: '2025_01_05', description: 'dayID single digit values' },
        {
          input: new Temporal.PlainDate(2025, 12, 25),
          expected: '2025_12_25',
          description: 'dayID double digit values',
        },
        { input: new Temporal.PlainDate(2000, 1, 1), expected: '2000_01_01', description: 'leading zero day' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(dayID(input)).toBe(expected);
      });
    });
  });

  describe('weekID', () => {
    it('should generate correct week IDs for various cases', () => {
      const testCases = [
        { input: new Temporal.PlainDate(2025, 1, 1), expected: '2024_12_30', description: 'Wednesday (start of week)' },
        { input: new Temporal.PlainDate(2025, 1, 7), expected: '2025_01_06', description: 'Tuesday (same week)' },
        { input: new Temporal.PlainDate(2025, 1, 3), expected: '2024_12_30', description: 'Friday (same week)' },
        {
          input: new Temporal.PlainDate(2025, 1, 31),
          expected: '2025_01_27',
          description: 'week spanning across months',
        },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(weekID(input)).toBe(expected);
      });
    });
  });

  describe('monthID', () => {
    it('should generate correct month IDs for various cases', () => {
      const testCases = [
        {
          input: new Temporal.PlainYearMonth(2025, 1),
          expected: '2025_01',
          description: 'monthID single digit values',
        },
        {
          input: new Temporal.PlainYearMonth(2025, 12),
          expected: '2025_12',
          description: 'monthID double digit values',
        },
        { input: new Temporal.PlainYearMonth(2000, 1), expected: '2000_01', description: 'leading zero month' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(monthID(input)).toBe(expected);
      });
    });
  });

  describe('yearID', () => {
    it('should generate correct year IDs for various cases', () => {
      const testCases = [
        { input: '2025', expected: '2025', description: 'string year' },
        { input: '2000', expected: '2000', description: 'string year 2000' },
        { input: 2025, expected: '2025', description: 'number year' },
        { input: 2000, expected: '2000', description: 'number year 2000' },
        { input: 0, expected: '0', description: 'zero year' },
        { input: '0', expected: '0', description: 'zero string year' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(yearID(input)).toBe(expected);
      });
    });
  });

  describe('getPlainDateIds', () => {
    it('should return correct IDs for various dates', () => {
      const testCases = [
        {
          input: new Temporal.PlainDate(2025, 1, 5),
          expected: ['2025', '2025_01', '2025_01_05'],
          description: 'getPlainDateIds single digit values',
        },
        {
          input: new Temporal.PlainDate(2025, 12, 25),
          expected: ['2025', '2025_12', '2025_12_25'],
          description: 'getPlainDateIds double digit values',
        },
        {
          input: new Temporal.PlainDate(2000, 1, 1),
          expected: ['2000', '2000_01', '2000_01_01'],
          description: 'year 2000',
        },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(getPlainDateIds(input)).toEqual(expected);
      });
    });
  });

  describe('parseHourID', () => {
    it('should parse hour IDs correctly for various cases', () => {
      const testCases = [
        {
          input: '2025_01_05_09',
          expected: { year: 2025, month: 1, day: 5, hour: 9 },
          description: 'parseHourID single digit values',
        },
        {
          input: '2025_12_25_23',
          expected: { year: 2025, month: 12, day: 25, hour: 23 },
          description: 'parseHourID double digit values',
        },
        {
          input: '2000_01_01_00',
          expected: { year: 2000, month: 1, day: 1, hour: 0 },
          description: 'leading zero hour',
        },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = parseHourID(input);

        expect(result.year).toBe(expected.year);
        expect(result.month).toBe(expected.month);
        expect(result.day).toBe(expected.day);
        expect(result.hour).toBe(expected.hour);
      });
    });
  });

  describe('parseDayID', () => {
    it('should parse day IDs correctly for various cases', () => {
      const testCases = [
        { input: '2025_01_05', expected: { year: 2025, month: 1, day: 5 }, description: 'single digit values' },
        { input: '2025_12_25', expected: { year: 2025, month: 12, day: 25 }, description: 'double digit values' },
        { input: '2000_01_01', expected: { year: 2000, month: 1, day: 1 }, description: 'leading zero day' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = parseDayID(input);

        expect(result.year).toBe(expected.year);
        expect(result.month).toBe(expected.month);
        expect(result.day).toBe(expected.day);
      });
    });
  });

  describe('parseWeekID', () => {
    it('should parse week IDs correctly for various cases', () => {
      const testCases = [
        { input: '2025_01_01', expected: { year: 2025, month: 1, day: 1 }, description: 'single digit values' },
        { input: '2025_12_25', expected: { year: 2025, month: 12, day: 25 }, description: 'double digit values' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = parseWeekID(input);

        expect(result.year).toBe(expected.year);
        expect(result.month).toBe(expected.month);
        expect(result.day).toBe(expected.day);
      });
    });
  });

  describe('parseMonthID', () => {
    it('should parse month IDs correctly for various cases', () => {
      const testCases = [
        { input: '2025_01', expected: { year: 2025, month: 1 }, description: 'single digit month' },
        { input: '2025_12', expected: { year: 2025, month: 12 }, description: 'double digit month' },
        { input: '2000_01', expected: { year: 2000, month: 1 }, description: 'leading zero month' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = parseMonthID(input);

        expect(result.year).toBe(expected.year);
        expect(result.month).toBe(expected.month);
      });
    });
  });

  describe('parseYearID', () => {
    it('should parse year IDs correctly for various cases', () => {
      const testCases = [
        { input: '2025', expected: 2025, description: 'normal year' },
        { input: '2000', expected: 2000, description: 'year 2000' },
        { input: '0', expected: 0, description: 'zero year' },
        { input: '1', expected: 1, description: 'single digit year' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(parseYearID(input)).toBe(expected);
      });
    });
  });

  describe('round-trip tests', () => {
    it('should maintain consistency for hourID/parseHourID', () => {
      const originalDateTime = new Temporal.PlainDateTime(2025, 1, 5, 9);
      const hourId = hourID(originalDateTime);
      const parsedDateTime = parseHourID(hourId);

      expect(parsedDateTime.equals(originalDateTime)).toBe(true);
    });

    it('should maintain consistency for dayID/parseDayID', () => {
      const originalDate = new Temporal.PlainDate(2025, 1, 5);
      const dayId = dayID(originalDate);
      const parsedDate = parseDayID(dayId);

      expect(parsedDate.equals(originalDate)).toBe(true);
    });

    it('should maintain consistency for monthID/parseMonthID', () => {
      const originalYearMonth = new Temporal.PlainYearMonth(2025, 1);
      const monthId = monthID(originalYearMonth);
      const parsedYearMonth = parseMonthID(monthId);

      expect(parsedYearMonth.equals(originalYearMonth)).toBe(true);
    });

    it('should maintain consistency for yearID/parseYearID', () => {
      const originalYear = 2025;
      const yearId = yearID(originalYear);
      const parsedYear = parseYearID(yearId);

      expect(parsedYear).toBe(originalYear);
    });
  });
});
