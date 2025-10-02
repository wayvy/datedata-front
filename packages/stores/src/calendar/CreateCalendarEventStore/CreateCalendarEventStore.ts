import { CalendarEvent } from '@repo/models';
import { CalendarEventApi, EventFormFieldValues, IApi, ICalendarEvent } from '@repo/types';
import { localDateTimeToUTC } from '@repo/utils';
import { action, makeObservable } from 'mobx';
import { Temporal } from 'temporal-polyfill';

import { AsyncStateStore, OpenStateStore } from '../../shared';

type CreateCalendarEventStoreParams = {
  api: IApi;
  addEvent: (event: ICalendarEvent) => void;
};

export class CreateCalendarEventStore {
  private readonly _api: IApi;
  private readonly _addEvent: (event: ICalendarEvent) => void;

  readonly openState = new OpenStateStore();
  readonly asyncState = new AsyncStateStore();

  constructor({ api, addEvent }: CreateCalendarEventStoreParams) {
    this._api = api;
    this._addEvent = addEvent;

    makeObservable(this, {
      fetchCreate: action,
      fetchDelete: action,
    });
  }

  fetchCreate = async (eventData: EventFormFieldValues<Temporal.PlainDateTime>): Promise<CalendarEventApi | null> => {
    this.asyncState.setLoadedStart();

    try {
      const requestData = this.buildEditPayload(eventData);

      const response = await this._api.post<CalendarEventApi>('/events', requestData);

      if (response.status !== 201) {
        this.handleApiError(response.data);

        return null;
      }

      this._addEvent(new CalendarEvent(response.data));
      this.openState.close();
      this.asyncState.setLoadedSuccess();

      return response.data;
    } catch (error) {
      this.handleApiError(error);

      return null;
    }
  };

  fetchDelete = async (id: string): Promise<boolean> => {
    this.asyncState.setLoadedStart();

    try {
      const response = await this._api.delete(`/events/${id}`);

      if (response.status !== 200) {
        this.handleApiError(response.data);

        return false;
      }

      this.asyncState.setLoadedSuccess();

      return true;
    } catch (error) {
      this.handleApiError(error);

      return false;
    }
  };

  private handleApiError = (error: unknown): void => {
    this.asyncState.setLoadedError(error);
  };

  private buildEditPayload = ({
    title,
    description,
    startDate,
    endDate,
    calendarId,
    allDay,
  }: EventFormFieldValues<Temporal.PlainDateTime>) => {
    return {
      title,
      description,
      start_date: this.buildStartDate(startDate),
      end_date: this.buildEndDate(startDate, endDate, allDay),
      calendar_id: calendarId,
      all_day: allDay,
    };
  };

  private buildStartDate = (startDate: Temporal.PlainDateTime): string => {
    return localDateTimeToUTC(startDate).toString();
  };

  private buildEndDate = (
    startDate: Temporal.PlainDateTime,
    endDate: Temporal.PlainDateTime,
    allDay: boolean,
  ): string => {
    const targetDate = allDay ? startDate : endDate;

    return localDateTimeToUTC(targetDate).toString();
  };
}
