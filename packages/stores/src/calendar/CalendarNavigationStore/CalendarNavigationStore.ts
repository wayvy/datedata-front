import { CalendarTab, ICalendarEvent, IDestroyable } from '@repo/types';
import { dayID } from '@repo/utils';
import { action, computed, makeObservable, observable } from 'mobx';
import { Temporal } from 'temporal-polyfill';

export class CalendarNavigationStore implements IDestroyable {
  _nowTimer: NodeJS.Timeout | null = null;
  now: Temporal.PlainDateTime = Temporal.Now.plainDateTimeISO();

  selectedDate: Temporal.PlainDateTime = Temporal.Now.plainDateTimeISO();
  selectedEvent: ICalendarEvent | null = null;

  currentTab: CalendarTab = CalendarTab.day;

  get nowDateId() {
    return dayID(this.now.toPlainDate());
  }

  get selectedDateId() {
    return dayID(this.selectedDate.toPlainDate());
  }

  constructor() {
    makeObservable(this, {
      currentTab: observable,
      setCurrentTab: action,
      selectedDate: observable,
      setSelectedDate: action,
      now: observable,
      tick: action,
      initTimer: action,
      destroyTimer: action,
      selectedEvent: observable,
      setSelectedEvent: action,
      prevSelectedDate: action,
      nextSelectedDate: action,
      nowSelectedDate: action,
      nowDateId: computed,
      selectedDateId: computed,
    });

    this.initTimer();
  }

  tick = () => {
    this.now = Temporal.Now.plainDateTimeISO();
    requestAnimationFrame(this.tick);
  };

  initTimer = () => {
    this.tick();
  };

  destroyTimer = () => {
    if (this._nowTimer) {
      clearInterval(this._nowTimer);
      this._nowTimer = null;
    }
  };

  setCurrentTab = (tab: string) => {
    this.currentTab = tab as CalendarTab;
  };

  setSelectedDate = (date: Temporal.PlainDateTime) => {
    this.selectedDate = date;
  };

  prevSelectedDate = () => {
    this.setSelectedDate(this.selectedDate.subtract({ days: 1 }));
  };

  nextSelectedDate = () => {
    this.setSelectedDate(this.selectedDate.add({ days: 1 }));
  };

  nowSelectedDate = () => {
    this.setSelectedDate(this.now);
  };

  setSelectedEvent = (event: ICalendarEvent | null) => {
    this.selectedEvent = event;
  };

  destroy = () => {
    this.destroyTimer();
  };
}
