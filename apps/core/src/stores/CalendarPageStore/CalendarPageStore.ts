import { CalendarStore, ChangeVisibilityStore } from '@repo/stores';
import { IApi, IDestroyable } from '@repo/types';
import { action, makeObservable } from 'mobx';

export class CalendarPageStore implements IDestroyable {
  calendar: CalendarStore;
  private _changeVisibility: ChangeVisibilityStore;

  constructor({ api, changeVisibility }: { api: IApi; changeVisibility: ChangeVisibilityStore }) {
    this.calendar = new CalendarStore({ api });
    this._changeVisibility = changeVisibility;

    makeObservable(this, {
      init: action,
      handleVisibilityChange: action,
    });
  }

  init = async () => {
    await this.calendar.init();
    this._changeVisibility.addCallback(this.handleVisibilityChange);
  };

  destroy = () => {
    this._changeVisibility.removeCallback(this.handleVisibilityChange);
    this.calendar.destroy();
  };

  handleVisibilityChange = async () => {
    await this.calendar.refreshSilent();
  };
}
