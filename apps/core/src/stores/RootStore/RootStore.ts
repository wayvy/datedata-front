import { AuthStore, ChangeVisibilityStore } from '@repo/stores';
import { action, makeObservable, observable } from 'mobx';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export class RootStore extends AuthStore {
  isMobile = true;
  changeVisibility = new ChangeVisibilityStore();

  constructor() {
    super(API_URL);

    makeObservable(this, {
      isMobile: observable,
      toggleIsMobile: action,
      setIsMobile: action,
    });
  }

  setIsMobile = (isMobile: boolean) => {
    this.isMobile = isMobile;
  };

  toggleIsMobile = () => {
    this.isMobile = !this.isMobile;
  };
}
