import { CalendarEventApi, DayID, EventMode, ICalendarEvent, MonthID, YearID } from '@repo/types';
import { getPlainDateIds } from '@repo/utils';
import { action, makeObservable, observable, ObservableMap } from 'mobx';
import { Temporal } from 'temporal-polyfill';

import { CalendarEvent } from '../calendar-event';

const sortDateEvents = (events: CalendarEvent[]): CalendarEvent[] => {
  return events.sort(
    (a, b) => a.start.toZonedDateTime('UTC').epochMilliseconds - b.start.toZonedDateTime('UTC').epochMilliseconds,
  );
};

const sortAllDayEvents = (events: CalendarEvent[]): CalendarEvent[] => {
  return events.sort((a, b) => a.calendarId.localeCompare(b.calendarId));
};

export class CalendarEventsMap {
  map: ObservableMap<EventMode, ObservableMap<YearID, ObservableMap<MonthID, ObservableMap<DayID, CalendarEvent[]>>>>;

  constructor() {
    this.map = observable.map();

    makeObservable(this, {
      add: action,
      delete: action,
      update: action,
      clear: action,
      setListFromApi: action,
      addFromApi: action,
    });
  }

  getEventsByPlainDate = (mode: EventMode, date: Temporal.PlainDate): CalendarEvent[] => {
    const [yearId, monthId, dayId] = getPlainDateIds(date);
    const events = this.map.get(mode)?.get(yearId)?.get(monthId)?.get(dayId) || [];

    return events;
  };

  clear = () => {
    this.map.clear();
  };

  add = (event: CalendarEvent) => {
    const [yearId, monthId, dayId] = getPlainDateIds(event.start.toPlainDate());
    const mode = event.allDay ? EventMode.allDay : EventMode.date;

    if (!this.map.has(mode)) {
      this.map.set(mode, observable.map());
    }

    const modeMap = this.map.get(mode)!;

    if (!modeMap.has(yearId)) {
      modeMap.set(yearId, observable.map());
    }

    const yearMap = modeMap.get(yearId)!;

    if (!yearMap.has(monthId)) {
      yearMap.set(monthId, observable.map());
    }

    const monthMap = yearMap.get(monthId)!;
    const dayEvents = monthMap.get(dayId) || [];

    if (event.allDay) {
      monthMap.set(dayId, sortAllDayEvents([...dayEvents, event]));
    } else {
      monthMap.set(dayId, sortDateEvents([...dayEvents, event]));
    }
  };

  delete = (event: ICalendarEvent) => {
    const [yearId, monthId, dayId] = getPlainDateIds(event.start.toPlainDate());
    const mode = event.allDay ? EventMode.allDay : EventMode.date;

    const modeMap = this.map.get(mode)!;
    const yearMap = modeMap.get(yearId)!;
    const monthMap = yearMap.get(monthId)!;
    const dayEvents = monthMap.get(dayId) || [];

    monthMap.set(
      dayId,
      dayEvents.filter((e) => e.id !== event.id),
    );
  };

  update = (prevEvent: ICalendarEvent, nextEvent: ICalendarEvent): void => {
    this.delete(prevEvent);
    this.add(nextEvent);
  };

  addFromApi = (event: CalendarEventApi): void => {
    const eventModel = new CalendarEvent(event);

    this.add(eventModel);
  };

  setListFromApi = (events: CalendarEventApi[]): void => {
    this.clear();

    for (const eventData of events) {
      const event = new CalendarEvent(eventData);

      this.add(event);
    }
  };
}
