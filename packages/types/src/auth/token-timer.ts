import type { IDestroyable } from '@repo/types';

export interface ITokenTimer extends IDestroyable {
  start: () => void;
  stop: () => void;
  restart: () => void;
}

export interface ITokenRefreshHandler {
  refreshToken(): Promise<string | null>;
  onTokenExpired(): void;
}

export interface ITokenTimerCallbacks {
  onTokenExpiringSoon: () => Promise<void>;
  getExpirationTime: () => number | null; // timestamp seconds
}

export type TokenTimerConfig = {
  checkInterval: number; // milliseconds
  refreshBeforeExpiry: number; // seconds
};
