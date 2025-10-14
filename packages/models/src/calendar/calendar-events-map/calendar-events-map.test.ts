import type { CalendarEventApi } from '@repo/types';
import { EventMode } from '@repo/types';
import { getPlainDateIds, utcStringToLocalDateTime } from '@repo/utils';
import { Temporal } from 'temporal-polyfill';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { CalendarEvent } from '../calendar-event';

import { CalendarEventsMap } from './calendar-events-map';

vi.mock('@repo/utils', () => ({
  getPlainDateIds: vi.fn(),
  utcStringToLocalDateTime: vi.fn(),
}));

vi.mock('../calendar-event', () => ({
  CalendarEvent: vi.fn(),
}));

const mockGetPlainDateIds = vi.mocked(getPlainDateIds);
const mockUtcStringToLocalDateTime = vi.mocked(utcStringToLocalDateTime);
const MockCalendarEvent = vi.mocked(CalendarEvent);

describe('CalendarEventsMap', () => {
  let calendarEventsMap: CalendarEventsMap;

  const DEFAULT_EVENT_ID = 'event-123';
  const DEFAULT_CALENDAR_ID = 'calendar-456';
  const DEFAULT_START_DATE = '2025-01-15T10:30:00Z';
  const DEFAULT_END_DATE = '2025-01-15T12:00:00Z';
  const DEFAULT_TITLE = 'Test Event';
  const DEFAULT_DESCRIPTION = 'Test event description';
  const DEFAULT_DATE_STRING = '2025-01-15';
  const EVENT_ID_1 = 'event-1';
  const EVENT_ID_2 = 'event-2';
  const API_EVENT_ID_1 = 'api-event-1';
  const API_EVENT_ID_2 = 'api-event-2';
  const EXISTING_EVENT_ID = 'existing-event';
  const NON_EXISTENT_EVENT_ID = 'non-existent-event';
  const DATE_1 = '2025-01-15';
  const DATE_2 = '2025-01-16';
  const DATE_JAN_31 = '2025-01-31';
  const DATE_FEB_01 = '2025-02-01';
  const DATE_DEC_31 = '2024-12-31';
  const DATE_JAN_01 = '2025-01-01';
  const EVENT_DATE_ID = 'date-event';
  const EVENT_ALL_DAY_ID = 'all-day-event';
  const EVENT_EARLY_ID = 'early-event';
  const EVENT_LATE_ID = 'late-event';
  const EVENT_A_ID = 'event-a';
  const EVENT_B_ID = 'event-b';
  const CALENDAR_A_ID = 'calendar-a';
  const CALENDAR_B_ID = 'calendar-b';

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

  const createMockCalendarEvent = (overrides: Partial<CalendarEventApi> = {}): CalendarEvent => {
    const eventApi = createMockCalendarEventApi(overrides);

    const mockStartDateTime = mockUtcStringToLocalDateTime(eventApi.start_date);
    const mockEndDateTime = mockUtcStringToLocalDateTime(eventApi.end_date);

    const mockEvent = {
      id: eventApi.id,
      title: eventApi.title,
      description: eventApi.description,
      start: mockStartDateTime,
      end: mockEndDateTime,
      allDay: eventApi.all_day,
      calendarId: eventApi.calendar_id,
    } as CalendarEvent;

    MockCalendarEvent.mockImplementation(() => mockEvent);

    return mockEvent;
  };

  const mockPlainDate = Temporal.PlainDate.from(DEFAULT_DATE_STRING);

  const createEventWithTime = (id: string, time: string) =>
    createMockCalendarEvent({
      id,
      start_date: `${DEFAULT_DATE_STRING}T${time}Z`,
      end_date: `${DEFAULT_DATE_STRING}T${time.replace(/(\d{2}):(\d{2})/, (_, h, m) => `${(parseInt(h) + 1).toString().padStart(2, '0')}:${m}`)}Z`,
    });

  const createEventWithDate = (id: string, date: string) =>
    createMockCalendarEvent({
      id,
      start_date: `${date}T10:00:00Z`,
      end_date: `${date}T11:00:00Z`,
    });

  const createAllDayEvent = (id: string, calendarId: string) =>
    createMockCalendarEvent({
      id,
      calendar_id: calendarId,
      all_day: true,
    });

  const expectEvents = (mode: EventMode, date: Temporal.PlainDate, expectedIds: string[]) => {
    const events = calendarEventsMap.getEventsByPlainDate(mode, date);

    expect(events.map((e) => e.id)).toEqual(expectedIds);
  };

  const expectEmptyEvents = (mode: EventMode, date: Temporal.PlainDate) => {
    expectEvents(mode, date, []);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    calendarEventsMap = new CalendarEventsMap();
    mockGetPlainDateIds.mockImplementation((date: Temporal.PlainDate) => {
      const yearId = date.year.toString();
      const monthId = `${date.year}-${date.month.toString().padStart(2, '0')}`;
      const dayId = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;

      return [yearId, monthId, dayId] as [string, string, string];
    });

    mockUtcStringToLocalDateTime.mockImplementation((utcString: string) => {
      const dateTimeString = utcString.replace('Z', '');

      return Temporal.PlainDateTime.from(dateTimeString);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create CalendarEventsMap instance with empty map', () => {
      expect(calendarEventsMap).toBeInstanceOf(CalendarEventsMap);
      expect(calendarEventsMap.map.size).toBe(0);
    });
  });

  describe('getEventsByPlainDate', () => {
    it('should return empty array when no events exist', () => {
      expectEmptyEvents(EventMode.date, mockPlainDate);
      expect(mockGetPlainDateIds).toHaveBeenCalledWith(mockPlainDate);
    });

    it('should return events for the specified date and mode', () => {
      const mockEvent = createMockCalendarEvent();

      calendarEventsMap.add(mockEvent);

      expectEvents(EventMode.date, mockPlainDate, [mockEvent.id]);
    });

    it('should separate date and all-day events correctly', () => {
      const dateEvent = createMockCalendarEvent({ id: EVENT_DATE_ID, all_day: false });
      const allDayEvent = createMockCalendarEvent({ id: EVENT_ALL_DAY_ID, all_day: true });

      calendarEventsMap.add(dateEvent);
      calendarEventsMap.add(allDayEvent);

      expectEvents(EventMode.date, mockPlainDate, [EVENT_DATE_ID]);
      expectEvents(EventMode.allDay, mockPlainDate, [EVENT_ALL_DAY_ID]);
    });
  });

  describe('add', () => {
    it('should sort date events by start time', () => {
      const earlyEvent = createEventWithTime(EVENT_EARLY_ID, '09:00:00');
      const lateEvent = createEventWithTime(EVENT_LATE_ID, '11:00:00');

      calendarEventsMap.add(lateEvent);
      calendarEventsMap.add(earlyEvent);

      expectEvents(EventMode.date, mockPlainDate, [EVENT_EARLY_ID, EVENT_LATE_ID]);
    });

    it('should sort all-day events by calendar ID', () => {
      const eventA = createAllDayEvent(EVENT_A_ID, CALENDAR_A_ID);
      const eventB = createAllDayEvent(EVENT_B_ID, CALENDAR_B_ID);

      calendarEventsMap.add(eventB);
      calendarEventsMap.add(eventA);

      expectEvents(EventMode.allDay, mockPlainDate, [EVENT_A_ID, EVENT_B_ID]);
    });

    it('should handle events with same start time correctly', () => {
      const event1 = createEventWithTime(EVENT_ID_1, '10:00:00');
      const event2 = createEventWithTime(EVENT_ID_2, '10:00:00');

      calendarEventsMap.add(event1);
      calendarEventsMap.add(event2);

      const events = calendarEventsMap.getEventsByPlainDate(EventMode.date, mockPlainDate);

      expect(events).toHaveLength(2);
      expect(events.map((e) => e.id)).toContain(EVENT_ID_1);
      expect(events.map((e) => e.id)).toContain(EVENT_ID_2);
    });

    it.each([
      { id1: 'jan-event', d1: DATE_JAN_31, id2: 'feb-event', d2: DATE_FEB_01 },
      { id1: 'dec-event', d1: DATE_DEC_31, id2: 'jan-event', d2: DATE_JAN_01 },
    ])('should handle events across calendar boundaries: $d1 and $d2', ({ id1, d1, id2, d2 }) => {
      const event1 = createEventWithDate(id1, d1);
      const event2 = createEventWithDate(id2, d2);

      calendarEventsMap.add(event1);
      calendarEventsMap.add(event2);

      expectEvents(EventMode.date, Temporal.PlainDate.from(d1), [id1]);
      expectEvents(EventMode.date, Temporal.PlainDate.from(d2), [id2]);
    });
  });

  describe('delete', () => {
    it('should delete event from the map', () => {
      const mockEvent = createMockCalendarEvent();

      calendarEventsMap.add(mockEvent);
      calendarEventsMap.delete(mockEvent);

      expectEmptyEvents(EventMode.date, mockPlainDate);
    });

    it('should delete only the specified event when multiple events exist', () => {
      const event1 = createMockCalendarEvent({ id: EVENT_ID_1 });
      const event2 = createMockCalendarEvent({ id: EVENT_ID_2 });

      calendarEventsMap.add(event1);
      calendarEventsMap.add(event2);
      calendarEventsMap.delete(event1);

      expectEvents(EventMode.date, mockPlainDate, [EVENT_ID_2]);
    });

    it('should handle deleting non-existent events gracefully', () => {
      const existingEvent = createMockCalendarEvent({ id: EXISTING_EVENT_ID });
      const nonExistentEvent = createMockCalendarEvent({ id: NON_EXISTENT_EVENT_ID });

      calendarEventsMap.add(existingEvent);

      expect(() => {
        calendarEventsMap.delete(nonExistentEvent);
      }).not.toThrow();

      expectEvents(EventMode.date, mockPlainDate, [EXISTING_EVENT_ID]);
    });

    it('should handle deleting events from different dates', () => {
      const event1 = createEventWithDate(EVENT_ID_1, DATE_1);
      const event2 = createEventWithDate(EVENT_ID_2, DATE_2);

      calendarEventsMap.add(event1);
      calendarEventsMap.add(event2);
      calendarEventsMap.delete(event2);

      expectEvents(EventMode.date, Temporal.PlainDate.from(DATE_1), [EVENT_ID_1]);
      expectEmptyEvents(EventMode.date, Temporal.PlainDate.from(DATE_2));
    });

    it('should leave day entry empty when deleting the last event of the day', () => {
      const event = createMockCalendarEvent({ id: EXISTING_EVENT_ID });

      calendarEventsMap.add(event);
      expectEvents(EventMode.date, mockPlainDate, [EXISTING_EVENT_ID]);

      calendarEventsMap.delete(event);

      expectEmptyEvents(EventMode.date, mockPlainDate);
    });

    it('should delete all-day event correctly (cover allDay mode path)', () => {
      const allDay = createAllDayEvent(EVENT_ALL_DAY_ID, CALENDAR_A_ID);

      calendarEventsMap.add(allDay);
      expectEvents(EventMode.allDay, mockPlainDate, [EVENT_ALL_DAY_ID]);

      calendarEventsMap.delete(allDay);

      expectEmptyEvents(EventMode.allDay, mockPlainDate);
    });

    it('should handle delete for a day without an existing bucket (maps exist, day missing)', () => {
      const eventOn15th = createEventWithDate(EVENT_ID_1, DATE_1);

      calendarEventsMap.add(eventOn15th);

      const eventOn16th = createEventWithDate('ghost-event', DATE_2);

      expect(() => {
        calendarEventsMap.delete(eventOn16th);
      }).not.toThrow();

      expectEvents(EventMode.date, Temporal.PlainDate.from(DATE_1), [EVENT_ID_1]);

      expectEmptyEvents(EventMode.date, Temporal.PlainDate.from(DATE_2));
    });
  });

  describe('update', () => {
    it('should update event by deleting old and adding new', () => {
      const oldEvent = createMockCalendarEvent({ id: 'old-event' });
      const newEvent = createMockCalendarEvent({ id: 'new-event', title: 'Updated Event' });

      calendarEventsMap.add(oldEvent);
      calendarEventsMap.update(oldEvent, newEvent);

      expectEvents(EventMode.date, mockPlainDate, ['new-event']);
    });

    it('should handle updating event with different date', () => {
      const oldEvent = createEventWithDate('old-event', DATE_1);
      const newEvent = createEventWithDate('new-event', DATE_2);

      calendarEventsMap.add(oldEvent);
      calendarEventsMap.update(oldEvent, newEvent);

      expectEmptyEvents(EventMode.date, Temporal.PlainDate.from(DATE_1));
      expectEvents(EventMode.date, Temporal.PlainDate.from(DATE_2), ['new-event']);
    });

    it('should handle updating event from date to all-day', () => {
      const dateEvent = createMockCalendarEvent({ id: 'date-event', all_day: false });
      const allDayEvent = createMockCalendarEvent({ id: EVENT_ALL_DAY_ID, all_day: true });

      calendarEventsMap.add(dateEvent);
      calendarEventsMap.update(dateEvent, allDayEvent);

      expectEmptyEvents(EventMode.date, mockPlainDate);
      expectEvents(EventMode.allDay, mockPlainDate, [EVENT_ALL_DAY_ID]);
    });
  });

  describe('clear', () => {
    it('should clear all events from the map', () => {
      const mockEvent = createMockCalendarEvent();

      calendarEventsMap.add(mockEvent);
      calendarEventsMap.clear();

      expect(calendarEventsMap.map.size).toBe(0);
    });
  });

  describe('addFromApi', () => {
    it('should create CalendarEvent from API data and add it', () => {
      const eventApi = createMockCalendarEventApi();
      const mockEvent = createMockCalendarEvent();

      calendarEventsMap.addFromApi(eventApi);

      expect(MockCalendarEvent).toHaveBeenCalledWith(eventApi);
      expectEvents(EventMode.date, mockPlainDate, [mockEvent.id]);
    });
  });

  describe('setListFromApi', () => {
    it('should clear existing events and add new events from API', () => {
      const existingEvent = createMockCalendarEvent({ id: EXISTING_EVENT_ID });

      calendarEventsMap.add(existingEvent);

      const eventApi1 = createMockCalendarEventApi({ id: API_EVENT_ID_1 });
      const eventApi2 = createMockCalendarEventApi({ id: API_EVENT_ID_2 });

      const mockEvent1 = {
        id: API_EVENT_ID_1,
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        start: mockUtcStringToLocalDateTime(eventApi1.start_date),
        end: mockUtcStringToLocalDateTime(eventApi1.end_date),
        allDay: false,
        calendarId: DEFAULT_CALENDAR_ID,
      } as CalendarEvent;

      const mockEvent2 = {
        id: API_EVENT_ID_2,
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        start: mockUtcStringToLocalDateTime(eventApi2.start_date),
        end: mockUtcStringToLocalDateTime(eventApi2.end_date),
        allDay: false,
        calendarId: DEFAULT_CALENDAR_ID,
      } as CalendarEvent;

      MockCalendarEvent.mockImplementation((api: CalendarEventApi) => {
        if (api.id === API_EVENT_ID_1) {
          return mockEvent1;
        }
        if (api.id === API_EVENT_ID_2) {
          return mockEvent2;
        }

        return mockEvent1;
      });

      calendarEventsMap.setListFromApi([eventApi1, eventApi2]);

      expect(MockCalendarEvent).toHaveBeenCalledWith(eventApi1);
      expect(MockCalendarEvent).toHaveBeenCalledWith(eventApi2);

      const events = calendarEventsMap.getEventsByPlainDate(EventMode.date, mockPlainDate);

      expect(events).toHaveLength(2);
      expect(events.map((e) => e.id)).toContain(API_EVENT_ID_1);
      expect(events.map((e) => e.id)).toContain(API_EVENT_ID_2);
    });

    it('should handle empty API list', () => {
      const existingEvent = createMockCalendarEvent();

      calendarEventsMap.add(existingEvent);
      calendarEventsMap.setListFromApi([]);

      expect(calendarEventsMap.map.size).toBe(0);
    });
  });
});
