import { Calendar } from '@repo/models';
import type { CalendarApi, IApi, ICalendar } from '@repo/types';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { AsyncStateStore, OpenStateStore } from '../../shared';

type CalendarsResponse = {
  calendars: CalendarApi[];
  total: number;
};

type UpdateCalendarParams = {
  calendar: ICalendar;
  checked?: boolean;
  title?: string;
  description?: string;
  color?: string;
};

type CalendarEntitiesStoreParams = {
  api: IApi;
};

export class CalendarEntitiesStore {
  private _api: IApi;

  openState = new OpenStateStore();
  asyncState = new AsyncStateStore();

  list: Calendar[] = [];

  get visibleList(): Calendar[] {
    return this.list.filter((calendar) => calendar.checked).sort((a, b) => a.id.localeCompare(b.id));
  }

  constructor({ api }: CalendarEntitiesStoreParams) {
    this._api = api;

    makeObservable(this, {
      list: observable.ref,
      visibleList: computed,
      setChecked: action,
      fetchCalendars: action,
      fetchCalendarsSilent: action,
      fetchEditCalendar: action,
      getCalendar: action,
    });
  }

  private setList = (calendars: Calendar[]): void => {
    this.list = calendars;
  };

  private updateCalendar = (calendar: Calendar): void => {
    this.list = this.list.map((c) => (c.id === calendar.id ? calendar : c));
  };

  getVisibleCalendars = (): Calendar[] => {
    return this.visibleList;
  };

  fetchCalendars = async (): Promise<void> => {
    try {
      this.asyncState.setLoadedStart();

      const { data } = await this._api.get<CalendarsResponse>('/calendars');

      runInAction(() => {
        if (data?.calendars && Array.isArray(data.calendars)) {
          this.setList(data.calendars.map((calendar) => new Calendar(calendar)));
        } else {
          this.setList([]);
        }
        this.asyncState.setLoadedSuccess();
      });
    } catch (error) {
      runInAction(() => {
        this.asyncState.setLoadedError(error instanceof Error ? error.message : 'Unknown error');
      });
      throw error;
    }
  };

  fetchCalendarsSilent = async (): Promise<void> => {
    try {
      const { data } = await this._api.get<CalendarsResponse>('/calendars');

      runInAction(() => {
        if (data?.calendars && Array.isArray(data.calendars)) {
          this.setList(data.calendars.map((calendar) => new Calendar(calendar)));
        } else {
          this.setList([]);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Silent calendar fetch failed:', error);
    }
  };

  fetchEditCalendar = async (params: UpdateCalendarParams): Promise<void> => {
    const { calendar, checked, title, description, color } = params;

    try {
      this.asyncState.setLoadedStart();

      const result = await this._api.put<CalendarApi>(`/calendars/${calendar.id}`, {
        checked,
        title,
        description,
        color,
      });

      runInAction(() => {
        if (result.status === 200 && result.data) {
          this.updateCalendar(new Calendar(result.data));
          this.asyncState.setLoadedSuccess();
        } else {
          const errorMessage = result.statusText || 'Failed to update calendar';

          this.asyncState.setLoadedError(errorMessage);
          throw new Error(errorMessage);
        }
      });
    } catch (error) {
      runInAction(() => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        this.asyncState.setLoadedError(errorMessage);
      });
      throw error;
    }
  };

  getCalendar = (calendarId: string): Calendar | undefined => {
    return this.list.find((calendar) => calendar.id === calendarId);
  };

  getColor = (calendarId: string): string => {
    return this.getCalendar(calendarId)?.color ?? 'transparent';
  };

  getChecked = (calendarId: string): boolean => {
    return this.getCalendar(calendarId)?.checked ?? false;
  };

  setChecked = async (calendar: ICalendar, checked: boolean): Promise<void> => {
    await this.fetchEditCalendar({ calendar, checked });
  };
}
