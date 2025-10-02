import { IDestroyable } from '@repo/types';
import { action, makeObservable, observable } from 'mobx';

export type VisibilityChangeCallback = () => Promise<void> | void;

export class ChangeVisibilityStore implements IDestroyable {
  private _visibilityChangeHandler: (() => void) | null = null;
  private _windowFocusHandler: (() => void) | null = null;
  private _callbacks: Set<VisibilityChangeCallback> = new Set();
  private _lastVisibilityChangeTime: number = 0;
  private readonly _debounceMs: number = 5000;
  isRefreshing = false;

  constructor() {
    makeObservable(this, {
      isRefreshing: observable,
      addCallback: action,
      removeCallback: action,
      handleVisibilityChange: action,
    });
  }

  addCallback = (callback: VisibilityChangeCallback): void => {
    this._callbacks.add(callback);

    if (this._callbacks.size === 1) {
      this._setupVisibilityListener();
    }
  };

  removeCallback = (callback: VisibilityChangeCallback): void => {
    this._callbacks.delete(callback);

    if (this._callbacks.size === 0) {
      this._removeVisibilityListener();
    }
  };

  private _setupVisibilityListener = (): void => {
    this._visibilityChangeHandler = () => {
      if (document.visibilityState === 'visible') {
        this.handleVisibilityChange();
      }
    };

    document.addEventListener('visibilitychange', this._visibilityChangeHandler);

    this._windowFocusHandler = () => {
      if (document.visibilityState === 'visible') {
        this.handleVisibilityChange();
      }
    };

    window.addEventListener('focus', this._windowFocusHandler);
  };

  private _removeVisibilityListener = (): void => {
    if (this._visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this._visibilityChangeHandler);
      this._visibilityChangeHandler = null;
    }

    if (this._windowFocusHandler) {
      window.removeEventListener('focus', this._windowFocusHandler);
      this._windowFocusHandler = null;
    }
  };

  handleVisibilityChange = async (): Promise<void> => {
    const now = Date.now();

    if (now - this._lastVisibilityChangeTime < this._debounceMs) {
      return;
    }

    this._lastVisibilityChangeTime = now;
    this.isRefreshing = true;

    try {
      const promises = Array.from(this._callbacks).map(async (callback) => {
        try {
          await callback();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Visibility change callback failed:', error);
        }
      });

      await Promise.all(promises);
    } finally {
      this.isRefreshing = false;
    }
  };

  destroy = (): void => {
    this._removeVisibilityListener();
    this._callbacks.clear();
  };
}
