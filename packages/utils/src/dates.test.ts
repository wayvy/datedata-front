import { Temporal } from 'temporal-polyfill';
import { describe, it, expect } from 'vitest';

import { getDefaultEndTime } from './dates';

describe('dates', () => {
  describe('getDefaultEndTime', () => {
    it('should add 30 minutes by default', () => {
      const startDate = new Temporal.PlainDateTime(2025, 1, 15, 10, 0);
      const result = getDefaultEndTime(startDate);

      expect(result.hour).toBe(10);
      expect(result.minute).toBe(30);
      expect(result.day).toBe(15);
    });

    it('should add custom duration in minutes', () => {
      const startDate = new Temporal.PlainDateTime(2025, 1, 15, 10, 0);
      const result = getDefaultEndTime(startDate, 60);

      expect(result.hour).toBe(11);
      expect(result.minute).toBe(0);
      expect(result.day).toBe(15);
    });

    it('should handle hour transition', () => {
      const startDate = new Temporal.PlainDateTime(2025, 1, 15, 10, 45);
      const result = getDefaultEndTime(startDate, 30);

      expect(result.hour).toBe(11);
      expect(result.minute).toBe(15);
      expect(result.day).toBe(15);
    });

    it('should handle day transition', () => {
      const startDate = new Temporal.PlainDateTime(2025, 1, 15, 23, 45);
      const result = getDefaultEndTime(startDate, 30);

      expect(result.hour).toBe(0);
      expect(result.minute).toBe(15);
      expect(result.day).toBe(16);
    });

    it('should handle month transition', () => {
      const startDate = new Temporal.PlainDateTime(2025, 1, 31, 23, 45);
      const result = getDefaultEndTime(startDate, 30);

      expect(result.hour).toBe(0);
      expect(result.minute).toBe(15);
      expect(result.day).toBe(1);
      expect(result.month).toBe(2);
    });

    it('should handle year transition', () => {
      const startDate = new Temporal.PlainDateTime(2023, 12, 31, 23, 45);
      const result = getDefaultEndTime(startDate, 30);

      expect(result.hour).toBe(0);
      expect(result.minute).toBe(15);
      expect(result.day).toBe(1);
      expect(result.month).toBe(1);
      expect(result.year).toBe(2024);
    });

    it('should handle leap year transition', () => {
      const startDate = new Temporal.PlainDateTime(2024, 2, 29, 23, 45);
      const result = getDefaultEndTime(startDate, 30);

      expect(result.hour).toBe(0);
      expect(result.minute).toBe(15);
      expect(result.day).toBe(1);
      expect(result.month).toBe(3);
    });

    it('should preserve other date components', () => {
      const startDate = new Temporal.PlainDateTime(2025, 6, 15, 14, 25);
      const result = getDefaultEndTime(startDate, 30);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(6);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(14);
      expect(result.minute).toBe(55);
      expect(result.second).toBe(0);
      expect(result.nanosecond).toBe(0);
    });

    it('should handle zero duration', () => {
      const startDate = new Temporal.PlainDateTime(2025, 1, 15, 10, 30);
      const result = getDefaultEndTime(startDate, 0);

      expect(result.equals(startDate)).toBe(true);
    });

    it('should handle negative duration', () => {
      const startDate = new Temporal.PlainDateTime(2025, 1, 15, 10, 30);
      const result = getDefaultEndTime(startDate, -30);

      expect(result.hour).toBe(10);
      expect(result.minute).toBe(0);
      expect(result.day).toBe(15);
    });

    it('should handle large duration', () => {
      const startDate = new Temporal.PlainDateTime(2025, 1, 15, 10, 0);
      const result = getDefaultEndTime(startDate, 150);

      expect(result.hour).toBe(12);
      expect(result.minute).toBe(30);
      expect(result.day).toBe(15);
    });

    it('should handle duration spanning multiple days', () => {
      const startDate = new Temporal.PlainDateTime(2025, 1, 15, 10, 0);
      const result = getDefaultEndTime(startDate, 1440);

      expect(result.hour).toBe(10);
      expect(result.minute).toBe(0);
      expect(result.day).toBe(16);
    });

    it('should handle various duration values', () => {
      const startDate = new Temporal.PlainDateTime(2025, 1, 15, 10, 0);

      const testCases = [
        { duration: 15, expectedHour: 10, expectedMinute: 15 },
        { duration: 45, expectedHour: 10, expectedMinute: 45 },
        { duration: 90, expectedHour: 11, expectedMinute: 30 },
        { duration: 120, expectedHour: 12, expectedMinute: 0 },
        { duration: 180, expectedHour: 13, expectedMinute: 0 },
      ];

      testCases.forEach(({ duration, expectedHour, expectedMinute }) => {
        const result = getDefaultEndTime(startDate, duration);

        expect(result.hour).toBe(expectedHour);
        expect(result.minute).toBe(expectedMinute);
        expect(result.day).toBe(15);
      });
    });
  });
});
