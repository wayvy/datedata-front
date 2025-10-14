import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';

import { weekStart } from './week-start';

const mockWeekInfo = vi.fn();
const originalIntl = global.Intl;

Object.defineProperty(global, 'Intl', {
  value: {
    Locale: vi.fn(() => ({
      weekInfo: mockWeekInfo(),
    })),
  },
  writable: true,
});

describe('week-start', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(global, 'Intl', { value: originalIntl, writable: true });
  });

  describe('weekStart', () => {
    it('should return correct week start for Russian locale', () => {
      mockWeekInfo.mockReturnValue({ firstDay: 1 });

      const result = weekStart();

      expect(result).toBe(1);
    });

    it('should return correct week start for different locales', () => {
      const testCases = [
        { locale: 'en-US', expectedFirstDay: 0, description: 'US locale (Sunday)' },
        { locale: 'en-GB', expectedFirstDay: 1, description: 'UK locale (Monday)' },
        { locale: 'de-DE', expectedFirstDay: 1, description: 'German locale (Monday)' },
        { locale: 'fr-FR', expectedFirstDay: 1, description: 'French locale (Monday)' },
        { locale: 'ar-SA', expectedFirstDay: 0, description: 'Saudi locale (Sunday)' },
      ];

      testCases.forEach(({ expectedFirstDay }) => {
        mockWeekInfo.mockReturnValue({ firstDay: expectedFirstDay });

        const result = weekStart();

        expect(result).toBe(expectedFirstDay);
      });
    });

    it('should handle fallback cases when weekInfo is unavailable', () => {
      const fallbackCases = [
        { weekInfo: undefined, description: 'missing weekInfo' },
        { weekInfo: null, description: 'null weekInfo' },
        { weekInfo: {}, description: 'empty weekInfo object' },
        { weekInfo: { firstDay: null }, description: 'null firstDay' },
        { weekInfo: { firstDay: undefined }, description: 'undefined firstDay' },
      ];

      fallbackCases.forEach(({ weekInfo }) => {
        mockWeekInfo.mockReturnValue(weekInfo);

        const result = weekStart();

        expect(result).toBe(1);
      });
    });

    it('should handle various firstDay values', () => {
      const testCases = [
        { firstDay: 0, description: 'Sunday' },
        { firstDay: 1, description: 'Monday' },
        { firstDay: 2, description: 'Tuesday' },
        { firstDay: 3, description: 'Wednesday' },
        { firstDay: 4, description: 'Thursday' },
        { firstDay: 5, description: 'Friday' },
        { firstDay: 6, description: 'Saturday' },
      ];

      testCases.forEach(({ firstDay }) => {
        mockWeekInfo.mockReturnValue({ firstDay });

        const result = weekStart();

        expect(result).toBe(firstDay);
      });
    });

    it('should handle edge cases and complex objects', () => {
      const testCases = [
        { weekInfo: { firstDay: -1 }, expected: -1, description: 'negative firstDay' },
        { weekInfo: { firstDay: 7 }, expected: 7, description: 'firstDay > 6' },
        { weekInfo: { firstDay: 0.5 }, expected: 0.5, description: 'decimal firstDay' },
        {
          weekInfo: { firstDay: 1, minimalDays: 4, weekend: [6, 0] },
          expected: 1,
          description: 'complex weekInfo object',
        },
      ];

      testCases.forEach(({ weekInfo, expected }) => {
        mockWeekInfo.mockReturnValue(weekInfo);

        const result = weekStart();

        expect(result).toBe(expected);
      });
    });
  });
});
