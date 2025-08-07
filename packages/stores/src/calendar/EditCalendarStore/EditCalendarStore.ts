import { CalendarFormFieldValues, IApi, ICalendar } from '@repo/types';
import { action, makeObservable, observable } from 'mobx';

import { AsyncStateStore, OpenStateStore } from '../../shared';

type EditCalendarStoreParams = {
  api: IApi;
  onDeleteClose: () => Promise<void>;
  onEditClose: () => Promise<void>;
};

type CalendarUpdateData = {
  summary: string;
  description?: string;
  color: string;
};

export class EditCalendarStore {
  private readonly _api: IApi;
  private readonly _onDeleteClose: () => Promise<void>;
  private readonly _onEditClose: () => Promise<void>;

  readonly asyncState = new AsyncStateStore();
  readonly openState = new OpenStateStore();

  calendar: ICalendar | null = null;

  constructor(config: EditCalendarStoreParams) {
    this._api = config.api;
    this._onDeleteClose = config.onDeleteClose;
    this._onEditClose = config.onEditClose;

    makeObservable(this, {
      calendar: observable.ref,
      open: action,
      onClose: action,
      fetchSave: action,
      fetchDelete: action,
    });
  }

  open = (calendar: ICalendar): void => {
    this.calendar = calendar;
    this.openState.open();
  };

  onClose = (): void => {
    this.openState.close();
    this.calendar = null;
  };

  fetchSave = async (data: CalendarFormFieldValues, calendar: ICalendar): Promise<void> => {
    this.asyncState.setLoadedStart();

    try {
      const requestData: CalendarUpdateData = {
        summary: data.summary,
        description: data.description,
        color: data.color,
      };

      const response = await this._api.put(`/calendars/${calendar.id}`, requestData);

      if (response.status === 200) {
        this.onClose();
        await this._onEditClose();
        this.asyncState.setLoadedSuccess();
      }
    } catch (error) {
      this._handleError(error, this.asyncState);
    }
  };

  fetchDelete = async (calendar: ICalendar): Promise<void> => {
    try {
      const response = await this._api.delete(`/calendars/${calendar.id}`);

      if (response.status === 200) {
        await this._onDeleteClose();
      }
    } catch (error) {
      this._handleError(error, this.asyncState);
    }
  };

  private _handleError = (error: unknown, asyncState: AsyncStateStore): void => {
    const message = error instanceof Error ? error.message : 'Unknown error';

    asyncState.setLoadedError(message);
  };
}
