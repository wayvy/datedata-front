import { AsyncState } from '@repo/types';
import { action, computed, makeObservable, observable } from 'mobx';

import {
  getInitialAsyncState,
  getLoadedErrorAsyncState,
  getLoadedSuccessAsyncState,
  getLoadingStartAsyncState,
  isInitialAsyncState,
} from './utils';

export class AsyncStateStore {
  data: AsyncState;

  constructor(asyncState?: AsyncState) {
    this.data = asyncState || getInitialAsyncState();

    makeObservable<AsyncStateStore>(this, {
      data: observable.ref,
      isLoading: computed,
      isError: computed,
      isLoaded: computed,
      isInitial: computed,
      setLoadedStart: action.bound,
      setLoadedSuccess: action.bound,
      setLoadedError: action.bound,
      reset: action.bound,
    });
  }

  get isLoading(): boolean {
    return this.data.isLoading;
  }

  get isError(): boolean {
    return this.data.isError;
  }

  get isInitial(): boolean {
    return isInitialAsyncState(this.data);
  }

  get isLoaded(): boolean {
    return this.data.isLoaded;
  }

  reset = (): void => {
    this.data = getInitialAsyncState();
  };

  setLoadedStart = (): void => {
    this.data = getLoadingStartAsyncState();
  };

  setLoadedSuccess = (): void => {
    this.data = getLoadedSuccessAsyncState();
  };

  setLoadedError = (error: unknown): void => {
    if (error instanceof Error) {
      this.data = getLoadedErrorAsyncState(error.message);
    } else {
      this.data = getLoadedErrorAsyncState();
    }
  };
}
