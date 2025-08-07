import { CalendarEvent } from '@repo/models';
import { CalendarEventApi, IApi, ICalendarEvent } from '@repo/types';
import { localDateTimeToUTC } from '@repo/utils';
import { action, makeObservable, observable } from 'mobx';
import { Temporal } from 'temporal-polyfill';

import { AsyncStateStore, OpenStateStore } from '../../shared';

interface EditEventParams {
  id: string;
  title: string;
  description: string;
  startDate: Temporal.PlainDateTime;
  endDate: Temporal.PlainDateTime;
  calendarId: string;
  allDay: boolean;
}

type EditCalendarEventStoreParams = {
  api: IApi;
  updateEvent: (event: ICalendarEvent, prevEvent: ICalendarEvent) => void;
  deleteEvent: (event: ICalendarEvent) => void;
};

type PrivateFields = '_handleEditSuccess';

export class EditCalendarEventStore {
  private readonly _api: IApi;
  private readonly _updateEvent: (prevEvent: ICalendarEvent, nextEvent: ICalendarEvent) => void;
  private readonly _deleteEvent: (event: ICalendarEvent) => void;

  readonly openState = new OpenStateStore();
  readonly asyncState = new AsyncStateStore();

  event: ICalendarEvent | null = null;

  constructor({ api, updateEvent, deleteEvent }: EditCalendarEventStoreParams) {
    this._api = api;
    this._updateEvent = updateEvent;
    this._deleteEvent = deleteEvent;

    makeObservable<this, PrivateFields>(this, {
      event: observable.ref,
      fetchEdit: action,
      fetchDelete: action,
      open: action,
      _handleEditSuccess: action,
    });
  }

  open = (event: ICalendarEvent): void => {
    this.event = event;
    this.openState.open();
  };

  fetchEdit = async (params: EditEventParams): Promise<CalendarEventApi | void> => {
    this.asyncState.setLoadedStart();

    try {
      const payload = this._buildEditPayload(params);
      const response = await this._api.put<CalendarEventApi>(`/events/${params.id}`, payload);

      if (response.status !== 200) {
        this._handleError(response.data);

        return;
      }

      this._handleEditSuccess(response.data);

      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  };

  fetchDelete = async (event: ICalendarEvent): Promise<void> => {
    this.asyncState.setLoadedStart();

    try {
      const response = await this._api.delete(`/events/${event.id}`);

      if (response.status !== 200) {
        this._handleError(response.data);

        return;
      }

      this._handleDeleteSuccess(event);
    } catch (error) {
      this._handleError(error);
    }
  };

  private _buildEditPayload = (params: EditEventParams) => {
    const { title, description, startDate, endDate, calendarId, allDay } = params;

    return {
      title,
      description,
      start_date: this._buildStartDate(startDate),
      end_date: this._buildEndDate(startDate, endDate, allDay),
      calendar_id: calendarId,
      all_day: allDay,
    };
  };

  private _buildStartDate = (startDate: Temporal.PlainDateTime): string => {
    return localDateTimeToUTC(startDate).toString();
  };

  private _buildEndDate = (
    startDate: Temporal.PlainDateTime,
    endDate: Temporal.PlainDateTime,
    allDay: boolean,
  ): string => {
    const targetDate = allDay ? startDate : endDate;

    return localDateTimeToUTC(targetDate).toString();
  };

  private _handleError = (error: unknown): void => {
    this.asyncState.setLoadedError(error);
  };

  private _handleEditSuccess = (eventData: CalendarEventApi): void => {
    if (this.event) {
      this._updateEvent(this.event, new CalendarEvent(eventData));
    }
    this.openState.close();
    this.asyncState.setLoadedSuccess();
  };

  private _handleDeleteSuccess = (event: ICalendarEvent): void => {
    this._deleteEvent(event);
    this.openState.close();
    this.asyncState.setLoadedSuccess();
  };
}
