import { IApi, ICalendar } from '@repo/types';
import { action, makeObservable } from 'mobx';

import { AsyncStateStore } from '../shared';

import { CalendarEntitiesStore } from './CalendarEntitiesStore';
import { CalendarEventsStore } from './CalendarEventsStore';
import { CalendarNavigationStore } from './CalendarNavigationStore';
import { CreateCalendarEventStore } from './CreateCalendarEventStore';
import { CreateCalendarStore } from './CreateCalendarStore';
import { EditCalendarEventStore } from './EditCalendarEventStore';
import { EditCalendarStore } from './EditCalendarStore';

export class CalendarStore {
  readonly asyncState = new AsyncStateStore();

  readonly navigation = new CalendarNavigationStore();

  readonly calendarEntities: CalendarEntitiesStore;
  readonly events: CalendarEventsStore;

  readonly createEvent: CreateCalendarEventStore;
  readonly editEvent: EditCalendarEventStore;
  readonly createCalendar: CreateCalendarStore;
  readonly editCalendar: EditCalendarStore;

  constructor({ api }: { api: IApi }) {
    this.calendarEntities = new CalendarEntitiesStore({ api });
    this.events = new CalendarEventsStore({
      api,
      getVisibleCalendars: () => this.calendarEntities.visibleList,
    });

    this.createCalendar = new CreateCalendarStore({
      api,
      onCreateClose: this.onCalendarCreateClose,
    });

    this.editCalendar = new EditCalendarStore({
      api,
      onDeleteClose: this.onCalendarDeleteClose,
      onEditClose: this.onCalendarEditClose,
    });

    this.createEvent = new CreateCalendarEventStore({
      api,
      addEvent: this.events.add,
    });

    this.editEvent = new EditCalendarEventStore({
      api,
      updateEvent: this.events.update,
      deleteEvent: this.events.delete,
    });

    makeObservable(this, {
      init: action,
      refreshSilent: action,
      onCalendarCreateClose: action,
      onCalendarEditClose: action,
      onCalendarDeleteClose: action,
      setCheckedCalendar: action,
    });
  }

  onCalendarCreateClose = async () => {
    await this.calendarEntities.fetchCalendars();
  };

  onCalendarEditClose = async () => {
    await this.calendarEntities.fetchCalendars();
    await this.events.fetchEvents();
  };

  onCalendarDeleteClose = async () => {
    await this.calendarEntities.fetchCalendars();
    await this.events.fetchEvents();
    this.editCalendar.onClose();
  };

  setCheckedCalendar = async (calendar: ICalendar, checked: boolean) => {
    await this.calendarEntities.fetchEditCalendar({ calendar, checked });
    await this.events.fetchEvents();
  };

  init = async () => {
    this.asyncState.setLoadedStart();

    try {
      await this.calendarEntities.fetchCalendars();
      await this.events.fetchEvents();
      this.asyncState.setLoadedSuccess();
    } catch (error) {
      this.asyncState.setLoadedError(error);
    }
  };

  refreshSilent = async () => {
    try {
      await this.calendarEntities.fetchCalendarsSilent();
      await this.events.fetchEventsSilent();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Silent refresh failed:', error);
    }
  };

  destroy = () => {
    this.navigation.destroy();
    this.events.destroy();
  };
}
