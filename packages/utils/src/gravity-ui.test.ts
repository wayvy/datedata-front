import { dateTime } from '@gravity-ui/date-utils';
import { Temporal } from 'temporal-polyfill';
import { describe, it, expect } from 'vitest';

import { temporalToGravityDate, gravityDateToTemporal } from './gravity-ui';

const TEST_DATE_STRING = '2025-01-15T10:30:45';

describe('gravity-ui', () => {
  describe('temporalToGravityDate', () => {
    it('should convert Temporal.PlainDateTime to Gravity DateTime', () => {
      const temporalDate = new Temporal.PlainDateTime(2025, 1, 15, 10, 30, 45);
      const result = temporalToGravityDate(temporalDate);

      expect(result).toBeInstanceOf(Object);
      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(0); // Gravity UI uses 0-based months
      expect(result.date()).toBe(15);
      expect(result.hour()).toBe(10);
      expect(result.minute()).toBe(30);
      expect(result.second()).toBe(45);
    });

    it('should handle single digit values', () => {
      const temporalDate = new Temporal.PlainDateTime(2025, 1, 5, 9, 5, 5);
      const result = temporalToGravityDate(temporalDate);

      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(0); // January = 0
      expect(result.date()).toBe(5);
      expect(result.hour()).toBe(9);
      expect(result.minute()).toBe(5);
      expect(result.second()).toBe(5);
    });

    it('should handle double digit values', () => {
      const temporalDate = new Temporal.PlainDateTime(2025, 12, 25, 23, 59, 59);
      const result = temporalToGravityDate(temporalDate);

      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(11); // December = 11
      expect(result.date()).toBe(25);
      expect(result.hour()).toBe(23);
      expect(result.minute()).toBe(59);
      expect(result.second()).toBe(59);
    });

    it('should handle edge cases', () => {
      const temporalDate = new Temporal.PlainDateTime(2000, 1, 1, 0, 0, 0);
      const result = temporalToGravityDate(temporalDate);

      expect(result.year()).toBe(2000);
      expect(result.month()).toBe(0); // January = 0
      expect(result.date()).toBe(1);
      expect(result.hour()).toBe(0);
      expect(result.minute()).toBe(0);
      expect(result.second()).toBe(0);
    });

    it('should handle leap year', () => {
      const temporalDate = new Temporal.PlainDateTime(2024, 2, 29, 12, 0, 0);
      const result = temporalToGravityDate(temporalDate);

      expect(result.year()).toBe(2024);
      expect(result.month()).toBe(1); // February = 1
      expect(result.date()).toBe(29);
      expect(result.hour()).toBe(12);
      expect(result.minute()).toBe(0);
      expect(result.second()).toBe(0);
    });

    it('should map date-time fields correctly', () => {
      const temporalDate = new Temporal.PlainDateTime(2025, 6, 15, 14, 30, 0);
      const result = temporalToGravityDate(temporalDate);

      expect(result.year()).toBe(2025);
      expect(result.month()).toBe(5); // June = 5
      expect(result.date()).toBe(15);
      expect(result.hour()).toBe(14);
      expect(result.minute()).toBe(30);
      expect(result.second()).toBe(0);
    });
  });

  describe('gravityDateToTemporal', () => {
    it('should convert Gravity DateTime to Temporal.PlainDateTime', () => {
      const gravityDate = dateTime({ input: TEST_DATE_STRING });
      const result = gravityDateToTemporal(gravityDate);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(10);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
    });

    it('should handle single digit values', () => {
      const gravityDate = dateTime({ input: '2025-01-05T09:05:05' });
      const result = gravityDateToTemporal(gravityDate);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(5);
      expect(result.hour).toBe(9);
      expect(result.minute).toBe(5);
      expect(result.second).toBe(5);
    });

    it('should handle double digit values', () => {
      const gravityDate = dateTime({ input: '2025-12-25T23:59:59' });
      const result = gravityDateToTemporal(gravityDate);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(12);
      expect(result.day).toBe(25);
      expect(result.hour).toBe(23);
      expect(result.minute).toBe(59);
      expect(result.second).toBe(59);
    });

    it('should handle edge cases', () => {
      const gravityDate = dateTime({ input: '2000-01-01T00:00:00' });
      const result = gravityDateToTemporal(gravityDate);

      expect(result.year).toBe(2000);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
    });

    it('should handle leap year', () => {
      const gravityDate = dateTime({ input: '2024-02-29T12:00:00' });
      const result = gravityDateToTemporal(gravityDate);

      expect(result.year).toBe(2024);
      expect(result.month).toBe(2);
      expect(result.day).toBe(29);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
    });

    it('should handle various date formats', () => {
      const testCases = [TEST_DATE_STRING, '2025-01-15T10:30:45.000', '2025-01-15T10:30:45.123'];

      testCases.forEach((input) => {
        const gravityDate = dateTime({ input });
        const result = gravityDateToTemporal(gravityDate);

        expect(result.year).toBe(2025);
        expect(result.month).toBe(1);
        expect(result.day).toBe(15);
        expect(result.hour).toBe(10);
        expect(result.minute).toBe(30);
        expect(result.second).toBe(45);
      });
    });
  });

  describe('round-trip tests', () => {
    it('should maintain consistency for temporalToGravityDate -> gravityDateToTemporal', () => {
      const originalTemporal = new Temporal.PlainDateTime(2025, 1, 15, 10, 30, 45);
      const gravityDate = temporalToGravityDate(originalTemporal);
      const convertedTemporal = gravityDateToTemporal(gravityDate);

      expect(convertedTemporal.equals(originalTemporal)).toBe(true);
    });

    it('should maintain consistency for gravityDateToTemporal -> temporalToGravityDate', () => {
      const originalGravity = dateTime({ input: TEST_DATE_STRING });
      const temporalDate = gravityDateToTemporal(originalGravity);
      const convertedGravity = temporalToGravityDate(temporalDate);

      expect(convertedGravity.year()).toBe(originalGravity.year());
      expect(convertedGravity.month()).toBe(originalGravity.month());
      expect(convertedGravity.date()).toBe(originalGravity.date());
      expect(convertedGravity.hour()).toBe(originalGravity.hour());
      expect(convertedGravity.minute()).toBe(originalGravity.minute());
      expect(convertedGravity.second()).toBe(originalGravity.second());
    });

    it('should handle various date ranges', () => {
      const testDates = [
        new Temporal.PlainDateTime(2000, 1, 1, 0, 0, 0),
        new Temporal.PlainDateTime(2025, 6, 15, 12, 30, 45),
        new Temporal.PlainDateTime(2030, 12, 31, 23, 59, 59),
      ];

      testDates.forEach((temporalDate) => {
        const gravityDate = temporalToGravityDate(temporalDate);
        const convertedTemporal = gravityDateToTemporal(gravityDate);

        expect(convertedTemporal.equals(temporalDate)).toBe(true);
      });
    });

    it('should handle leap year dates', () => {
      const leapYearDate = new Temporal.PlainDateTime(2024, 2, 29, 12, 0, 0);
      const gravityDate = temporalToGravityDate(leapYearDate);
      const convertedTemporal = gravityDateToTemporal(gravityDate);

      expect(convertedTemporal.equals(leapYearDate)).toBe(true);
    });

    it('should handle edge cases with nanoseconds', () => {
      const temporalDate = new Temporal.PlainDateTime(2025, 1, 15, 10, 30, 45, 123, 456, 789);
      const gravityDate = temporalToGravityDate(temporalDate);
      const convertedTemporal = gravityDateToTemporal(gravityDate);

      expect(convertedTemporal.year).toBe(temporalDate.year);
      expect(convertedTemporal.month).toBe(temporalDate.month);
      expect(convertedTemporal.day).toBe(temporalDate.day);
      expect(convertedTemporal.hour).toBe(temporalDate.hour);
      expect(convertedTemporal.minute).toBe(temporalDate.minute);
      expect(convertedTemporal.second).toBe(temporalDate.second);
    });
  });
});
