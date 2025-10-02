import { CalendarEventsMap } from '@repo/models';
import { ICalendar, CalendarEventApi, EventMode, IApi, ICalendarEvent, IDestroyable } from '@repo/types';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Temporal } from 'temporal-polyfill';

import { AsyncStateStore } from '../../shared';

interface CalendarEventsStoreParams {
  api: IApi;
  getVisibleCalendars: () => ICalendar[];
}

interface EventsApiResponse {
  events: CalendarEventApi[];
  total: number;
}

export class CalendarEventsStore implements IDestroyable {
  private readonly _api: IApi;
  private readonly _getVisibleCalendars: () => ICalendar[];
  private _abortController: AbortController = new AbortController();

  readonly asyncState = new AsyncStateStore();

  readonly list: CalendarEventsMap;

  loadedCalendars: ICalendar[] = [];

  constructor({ api, getVisibleCalendars }: CalendarEventsStoreParams) {
    this._api = api;
    this._getVisibleCalendars = getVisibleCalendars;
    this.list = new CalendarEventsMap();

    makeObservable(this, {
      asyncState: observable.ref,
      list: observable,
      loadedCalendars: observable,
      setList: action,
      setLoadedCalendars: action,
      fetchEvents: action,
      fetchEventsSilent: action,
      delete: action,
      add: action,
      update: action,
      destroy: action,
    });
  }

  getEventsByPlainDate = (mode: EventMode, date: Temporal.PlainDate): ICalendarEvent[] => {
    return this.list.getEventsByPlainDate(mode, date);
  };

  setList = (events: CalendarEventApi[]): void => {
    this.list.setListFromApi(events);
  };

  setLoadedCalendars = (calendars: ICalendar[]): void => {
    this.loadedCalendars = [...calendars].sort((a, b) => a.id.localeCompare(b.id));
  };

  add = (event: ICalendarEvent): void => {
    if (this._isEventCalendarVisible(event)) {
      this.list.add(event);
    }
  };

  update = (prevEvent: ICalendarEvent, nextEvent: ICalendarEvent): void => {
    if (this._isEventCalendarVisible(nextEvent)) {
      this.list.update(prevEvent, nextEvent);
    }
  };

  delete = (event: ICalendarEvent): void => {
    this.list.delete(event);
  };

  fetchEvents = async (): Promise<void> => {
    this._cancelPreviousRequest();
    this._abortController = new AbortController();
    this.asyncState.setLoadedStart();
    try {
      const visibleCalendars = this._getVisibleCalendars();

      if (!this._hasVisibleCalendars(visibleCalendars)) {
        this._handleEmptyCalendars();

        return;
      }
      const eventsData = await this._fetchEventsFromApi(visibleCalendars);

      if (eventsData) {
        this._handleSuccessfulFetch(eventsData, visibleCalendars);
      }
    } catch (error) {
      this._handleFetchError(error);
    }
  };

  fetchEventsSilent = async (): Promise<void> => {
    this._cancelPreviousRequest();
    this._abortController = new AbortController();
    try {
      const visibleCalendars = this._getVisibleCalendars();

      if (!this._hasVisibleCalendars(visibleCalendars)) {
        this._handleEmptyCalendarsSilent();

        return;
      }
      const eventsData = await this._fetchEventsFromApi(visibleCalendars);

      if (eventsData) {
        this._handleSuccessfulFetchSilent(eventsData, visibleCalendars);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Silent events fetch failed:', error);
    }
  };

  destroy = (): void => {
    this._cancelPreviousRequest();
    this.list.clear();
    this.loadedCalendars = [];
  };

  private _isEventCalendarVisible = (event: ICalendarEvent): boolean => {
    return this._getVisibleCalendars().some((calendar) => calendar.id === event.calendarId);
  };

  private _cancelPreviousRequest = (): void => {
    if (this.asyncState.isLoading) {
      this._abortController.abort();
    }
  };

  private _hasVisibleCalendars = (calendars: ICalendar[]): boolean => {
    return calendars.length > 0;
  };

  private _handleEmptyCalendars = (): void => {
    this.list.setListFromApi([]);
    this.loadedCalendars = [];
    this.asyncState.setLoadedSuccess();
  };

  private _handleEmptyCalendarsSilent = (): void => {
    this.list.setListFromApi([]);
    this.loadedCalendars = [];
  };

  private _fetchEventsFromApi = async (calendars: ICalendar[]): Promise<EventsApiResponse | undefined> => {
    const params = this._buildCalendarParams(calendars);
    const url = `/events?${params}`;

    const { data } = await this._api.get<EventsApiResponse>(url, {
      signal: this._abortController.signal,
    });

    return data;
  };

  private _buildCalendarParams = (calendars: ICalendar[]): string => {
    return calendars.map((calendar) => `calendar_id=${calendar.id}`).join('&');
  };

  private _handleSuccessfulFetch = (eventsData: EventsApiResponse, calendars: ICalendar[]): void => {
    runInAction(() => {
      this.list.setListFromApi(eventsData.events);
      this.setLoadedCalendars(calendars);
      this.asyncState.setLoadedSuccess();
    });
  };

  private _handleSuccessfulFetchSilent = (eventsData: EventsApiResponse, calendars: ICalendar[]): void => {
    runInAction(() => {
      this.list.setListFromApi(eventsData.events);
      this.setLoadedCalendars(calendars);
    });
  };

  private _handleFetchError = (error: unknown): void => {
    runInAction(() => {
      if (this._isAbortError(error)) {
        return;
      }
      this.asyncState.setLoadedError(error);
    });
  };

  private _isAbortError = (error: unknown): boolean => {
    return error instanceof Error && error.name === 'AbortError';
  };
}
