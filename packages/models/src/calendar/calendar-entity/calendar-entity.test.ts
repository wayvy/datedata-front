import type { CalendarApi } from '@repo/types';
import { describe, it, expect } from 'vitest';

import { Calendar } from './calendar-entity';

describe('Calendar', () => {
  const DEFAULT_CALENDAR_ID = 'calendar-123';
  const DEFAULT_SUMMARY = 'Test Calendar';
  const DEFAULT_DESCRIPTION = 'Test calendar description';
  const DEFAULT_COLOR = '#FF5733';
  const DEFAULT_USER_ID = 'user-456';
  const DEFAULT_CREATED_AT = '2025-01-01T00:00:00Z';
  const DEFAULT_UPDATED_AT = '2025-01-02T00:00:00Z';

  const createMockCalendarApi = (overrides: Partial<CalendarApi> = {}): CalendarApi => ({
    id: DEFAULT_CALENDAR_ID,
    summary: DEFAULT_SUMMARY,
    description: DEFAULT_DESCRIPTION,
    color: DEFAULT_COLOR,
    user_id: DEFAULT_USER_ID,
    created_at: DEFAULT_CREATED_AT,
    updated_at: DEFAULT_UPDATED_AT,
    checked: true,
    ...overrides,
  });

  describe('constructor', () => {
    it.each([
      {
        name: 'default calendar',
        api: createMockCalendarApi(),
        expected: {
          id: DEFAULT_CALENDAR_ID,
          summary: DEFAULT_SUMMARY,
          description: DEFAULT_DESCRIPTION,
          color: DEFAULT_COLOR,
          userId: DEFAULT_USER_ID,
          createdAt: DEFAULT_CREATED_AT,
          updatedAt: DEFAULT_UPDATED_AT,
          checked: true,
        },
      },
      {
        name: 'custom calendar',
        api: createMockCalendarApi({
          id: 'unique-calendar-789',
          summary: 'Work Calendar',
          description: 'Calendar for work events',
          color: '#3498DB',
          user_id: 'user-999',
          created_at: '2023-12-01T10:30:00Z',
          updated_at: '2023-12-15T14:45:00Z',
          checked: false,
        }),
        expected: {
          id: 'unique-calendar-789',
          summary: 'Work Calendar',
          description: 'Calendar for work events',
          color: '#3498DB',
          userId: 'user-999',
          createdAt: '2023-12-01T10:30:00Z',
          updatedAt: '2023-12-15T14:45:00Z',
          checked: false,
        },
      },
      {
        name: 'empty calendar',
        api: createMockCalendarApi({
          id: '',
          summary: '',
          description: '',
          color: '',
          user_id: '',
          created_at: '',
          updated_at: '',
          checked: false,
        }),
        expected: {
          id: '',
          summary: '',
          description: '',
          color: '',
          userId: '',
          createdAt: '',
          updatedAt: '',
          checked: false,
        },
      },
    ])('should create Calendar instance and assign properties correctly: $name', ({ api, expected }) => {
      const calendar = new Calendar(api);

      expect(calendar.id).toBe(expected.id);
      expect(calendar.summary).toBe(expected.summary);
      expect(calendar.description).toBe(expected.description);
      expect(calendar.color).toBe(expected.color);
      expect(calendar.userId).toBe(expected.userId);
      expect(calendar.createdAt).toBe(expected.createdAt);
      expect(calendar.updatedAt).toBe(expected.updatedAt);
      expect(calendar.checked).toBe(expected.checked);
    });
  });
});
