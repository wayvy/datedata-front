import { CalendarStore } from '@repo/stores';
import { IApi, IDestroyable } from '@repo/types';
import { action, makeObservable } from 'mobx';

export class CalendarPageStore implements IDestroyable {
  calendar: CalendarStore;

  constructor({ api }: { api: IApi }) {
    this.calendar = new CalendarStore({ api });

    makeObservable(this, {
      init: action,
    });
  }

  init = async () => {
    await this.calendar.init();
  };

  destroy = () => {
    this.calendar.destroy();
  };
}
