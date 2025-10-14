import type { CalendarEventApi } from '@repo/types';
import { utcStringToLocalDateTime } from '@repo/utils';
import { Temporal } from 'temporal-polyfill';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { CalendarEvent } from './calendar-event';

vi.mock('@repo/utils', () => ({
  utcStringToLocalDateTime: vi.fn(),
}));

const mockUtcStringToLocalDateTime = vi.mocked(utcStringToLocalDateTime);

describe('CalendarEvent', () => {
  const DEFAULT_EVENT_ID = 'event-123';
  const DEFAULT_CALENDAR_ID = 'calendar-456';
  const DEFAULT_START_DATE = '2025-01-15T10:30:00Z';
  const DEFAULT_END_DATE = '2025-01-15T12:00:00Z';
  const DEFAULT_TITLE = 'Test Event';
  const DEFAULT_DESCRIPTION = 'Test event description';

  const createMockCalendarEventApi = (overrides: Partial<CalendarEventApi> = {}): CalendarEventApi => ({
    id: DEFAULT_EVENT_ID,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    start_date: DEFAULT_START_DATE,
    end_date: DEFAULT_END_DATE,
    all_day: false,
    calendar_id: DEFAULT_CALENDAR_ID,
    ...overrides,
  });

  const mockStartDateTime = new Temporal.PlainDateTime(2025, 1, 15, 10, 30, 0);
  const mockEndDateTime = new Temporal.PlainDateTime(2025, 1, 15, 12, 0, 0);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUtcStringToLocalDateTime.mockImplementation((utcString: string) => {
      if (utcString === DEFAULT_START_DATE) {
        return mockStartDateTime;
      }
      if (utcString === DEFAULT_END_DATE) {
        return mockEndDateTime;
      }

      return new Temporal.PlainDateTime(2025, 1, 1, 0, 0, 0);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it.each([
      {
        name: 'default event',
        api: createMockCalendarEventApi(),
        expected: {
          id: DEFAULT_EVENT_ID,
          title: DEFAULT_TITLE,
          description: DEFAULT_DESCRIPTION,
          start: mockStartDateTime,
          end: mockEndDateTime,
          allDay: false,
          calendarId: DEFAULT_CALENDAR_ID,
        },
      },
      {
        name: 'all-day event',
        api: createMockCalendarEventApi({
          all_day: true,
          title: 'All Day Event',
          description: 'All day event description',
        }),
        expected: {
          id: DEFAULT_EVENT_ID,
          title: 'All Day Event',
          description: 'All day event description',
          start: mockStartDateTime,
          end: mockEndDateTime,
          allDay: true,
          calendarId: DEFAULT_CALENDAR_ID,
        },
      },
      {
        name: 'event with empty strings',
        api: createMockCalendarEventApi({
          id: '',
          title: '',
          description: '',
          calendar_id: '',
        }),
        expected: {
          id: '',
          title: '',
          description: '',
          start: mockStartDateTime,
          end: mockEndDateTime,
          allDay: false,
          calendarId: '',
        },
      },
      {
        name: 'custom event with different dates',
        api: createMockCalendarEventApi({
          id: 'custom-event-789',
          title: 'Custom Event',
          description: 'Custom event description',
          start_date: '2024-12-25T09:00:00Z',
          end_date: '2024-12-25T17:00:00Z',
          calendar_id: 'custom-calendar-999',
        }),
        expected: {
          id: 'custom-event-789',
          title: 'Custom Event',
          description: 'Custom event description',
          start: new Temporal.PlainDateTime(2025, 1, 1, 0, 0, 0),
          end: new Temporal.PlainDateTime(2025, 1, 1, 0, 0, 0),
          allDay: false,
          calendarId: 'custom-calendar-999',
        },
      },
    ])('should create CalendarEvent instance correctly: $name', ({ api, expected }) => {
      const calendarEvent = new CalendarEvent(api);

      expect(calendarEvent.id).toBe(expected.id);
      expect(calendarEvent.title).toBe(expected.title);
      expect(calendarEvent.description).toBe(expected.description);
      expect(calendarEvent.start).toStrictEqual(expected.start);
      expect(calendarEvent.end).toStrictEqual(expected.end);
      expect(calendarEvent.allDay).toBe(expected.allDay);
      expect(calendarEvent.calendarId).toBe(expected.calendarId);
    });

    it('should call utcStringToLocalDateTime with correct parameters', () => {
      const eventApi = createMockCalendarEventApi();

      new CalendarEvent(eventApi);

      expect(mockUtcStringToLocalDateTime).toHaveBeenCalledTimes(2);
      expect(mockUtcStringToLocalDateTime).toHaveBeenCalledWith(DEFAULT_START_DATE);
      expect(mockUtcStringToLocalDateTime).toHaveBeenCalledWith(DEFAULT_END_DATE);
    });

    it('should handle different date formats correctly', () => {
      const customStartDate = '2024-06-15T14:30:00Z';
      const customEndDate = '2024-06-15T16:45:00Z';

      const customStartDateTime = new Temporal.PlainDateTime(2024, 6, 15, 14, 30, 0);
      const customEndDateTime = new Temporal.PlainDateTime(2024, 6, 15, 16, 45, 0);

      mockUtcStringToLocalDateTime.mockImplementation((utcString: string) => {
        if (utcString === customStartDate) {
          return customStartDateTime;
        }
        if (utcString === customEndDate) {
          return customEndDateTime;
        }

        return new Temporal.PlainDateTime(2025, 1, 1, 0, 0, 0);
      });

      const eventApi = createMockCalendarEventApi({
        start_date: customStartDate,
        end_date: customEndDate,
      });

      const calendarEvent = new CalendarEvent(eventApi);

      expect(calendarEvent.start).toStrictEqual(customStartDateTime);
      expect(calendarEvent.end).toStrictEqual(customEndDateTime);
      expect(mockUtcStringToLocalDateTime).toHaveBeenCalledWith(customStartDate);
      expect(mockUtcStringToLocalDateTime).toHaveBeenCalledWith(customEndDate);
    });
  });
});
