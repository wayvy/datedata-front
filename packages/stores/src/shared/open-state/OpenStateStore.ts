import { action, makeObservable, observable } from 'mobx';

export class OpenStateStore {
  isOpen: boolean;

  constructor(defaultValue = false) {
    this.isOpen = defaultValue;

    makeObservable(this, {
      isOpen: observable,
      open: action,
      close: action,
      toggle: action,
    });
  }

  open = () => {
    this.isOpen = true;
  };

  close = () => {
    this.isOpen = false;
  };

  toggle = () => {
    this.isOpen = !this.isOpen;
  };
}
