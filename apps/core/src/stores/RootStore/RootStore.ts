import { AuthStore } from '@repo/stores';
import { action, makeObservable, observable } from 'mobx';

const API_URL = import.meta.env.API_URL;

export class RootStore extends AuthStore {
  isMobile = true;

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
