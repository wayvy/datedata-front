import { Temporal } from 'temporal-polyfill';
import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';

import { localDateTimeToUTC, utcStringToLocalDateTime } from './timezone';

const TEST_DATE_TIME = '2025-01-15T10:30:45Z';
const TEST_DATE_TIME_MS = '2025-01-15T10:30:45.000Z';
const TEST_DATE_TIME_NS = '2025-01-15T10:30:45.123Z';
const TEST_DATETIME_2025_1_15 = new Temporal.PlainDateTime(2025, 1, 15, 10, 30, 45);
const TIMEZONE_UTC = 'UTC';
const TIMEZONE_MOSCOW = 'Europe/Moscow';
const TIMEZONE_NEW_YORK = 'America/New_York';
const TIMEZONE_TOKYO = 'Asia/Tokyo';

const mockResolvedOptions = vi.fn();
const originalIntl = global.Intl;

Object.defineProperty(global, 'Intl', {
  value: {
    DateTimeFormat: vi.fn(() => ({
      resolvedOptions: mockResolvedOptions,
    })),
  },
  writable: true,
});

describe('timezone', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResolvedOptions.mockReturnValue({ timeZone: TIMEZONE_UTC });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(global, 'Intl', { value: originalIntl });
  });

  describe('localDateTimeToUTC', () => {
    it('should convert local datetime to UTC', () => {
      const result = localDateTimeToUTC(TEST_DATETIME_2025_1_15);

      expect(result).toBeInstanceOf(Temporal.Instant);
    });
  });

  describe('utcStringToLocalDateTime', () => {
    it('should convert UTC string to local datetime', () => {
      const result = utcStringToLocalDateTime(TEST_DATE_TIME);

      expect(result).toBeInstanceOf(Temporal.PlainDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(15);
    });

    it('should handle different timezones correctly', () => {
      const timezoneTests = [
        { timezone: TIMEZONE_UTC, expectedHour: 10, description: 'UTC' },
        { timezone: TIMEZONE_MOSCOW, expectedHour: 13, description: 'Moscow (UTC+3)' },
        { timezone: TIMEZONE_NEW_YORK, expectedHour: 5, description: 'New York (UTC-5)' },
        { timezone: TIMEZONE_TOKYO, expectedHour: 19, description: 'Tokyo (UTC+9)' },
      ];

      timezoneTests.forEach(({ timezone, expectedHour }) => {
        mockResolvedOptions.mockReturnValue({ timeZone: timezone });

        const result = utcStringToLocalDateTime(TEST_DATE_TIME);

        expect(result).toBeInstanceOf(Temporal.PlainDateTime);
        expect(result.hour).toBe(expectedHour);
        expect(result.minute).toBe(30);
        expect(result.second).toBe(45);
      });
    });

    it('should handle various UTC string formats', () => {
      const testCases = [TEST_DATE_TIME, TEST_DATE_TIME_MS, TEST_DATE_TIME_NS];

      testCases.forEach((utcString) => {
        const result = utcStringToLocalDateTime(utcString);

        expect(result).toBeInstanceOf(Temporal.PlainDateTime);
        expect(result.year).toBe(2025);
        expect(result.month).toBe(1);
        expect(result.day).toBe(15);
        expect(result.hour).toBe(10);
        expect(result.minute).toBe(30);
        expect(result.second).toBe(45);
      });
    });

    it('should handle edge cases and special dates', () => {
      const edgeCases = [
        { input: '2000-01-01T00:00:00Z', year: 2000, month: 1, day: 1, description: 'Y2K' },
        { input: '2024-02-29T12:00:00Z', year: 2024, month: 2, day: 29, description: 'leap year' },
        { input: '2023-12-31T23:59:59Z', year: 2023, month: 12, day: 31, description: 'year transition' },
      ];

      edgeCases.forEach(({ input, year, month, day }) => {
        const result = utcStringToLocalDateTime(input);

        expect(result).toBeInstanceOf(Temporal.PlainDateTime);
        expect(result.year).toBe(year);
        expect(result.month).toBe(month);
        expect(result.day).toBe(day);
      });
    });
  });

  describe('round-trip tests', () => {
    it('should maintain consistency between conversions', () => {
      const testCases = [
        { date: new Temporal.PlainDateTime(2025, 1, 15, 10, 30, 45), description: 'normal date' },
        { date: new Temporal.PlainDateTime(2000, 1, 1, 0, 0, 0), description: 'Y2K' },
        { date: new Temporal.PlainDateTime(2024, 2, 29, 12, 0, 0), description: 'leap year' },
        { date: new Temporal.PlainDateTime(2023, 12, 31, 23, 59, 59), description: 'year transition' },
      ];

      const timezones = [TIMEZONE_UTC, TIMEZONE_MOSCOW, TIMEZONE_NEW_YORK, TIMEZONE_TOKYO];

      testCases.forEach(({ date }) => {
        timezones.forEach((timezone) => {
          mockResolvedOptions.mockReturnValue({ timeZone: timezone });

          const utcInstant = localDateTimeToUTC(date);
          const utcString = utcInstant.toString();
          const convertedDateTime = utcStringToLocalDateTime(utcString);

          expect(convertedDateTime.equals(date)).toBe(true);
        });
      });
    });
  });
});
