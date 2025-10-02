import { AsyncState } from '@repo/types';

export const getLoadingStartAsyncState = (): AsyncState => ({
  isLoading: true,
  isError: false,
  isLoaded: false,
});

export const getLoadedErrorAsyncState = (message?: string): AsyncState => ({
  isLoading: false,
  isError: true,
  isLoaded: false,
  message,
});

export const getLoadedSuccessAsyncState = (): AsyncState => ({
  isLoading: false,
  isError: false,
  isLoaded: true,
});

export const getInitialAsyncState = (): AsyncState => ({
  isLoading: false,
  isError: false,
  isLoaded: false,
});

export const isInitialAsyncState = (asyncState: AsyncState): boolean => getInitialAsyncState() === asyncState;
