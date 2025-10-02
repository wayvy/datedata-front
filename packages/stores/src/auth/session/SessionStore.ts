import type { ISessionStore } from '@repo/types';
import { jwtDecode } from 'jwt-decode';
import { makeObservable, action, observable, computed } from 'mobx';

import { TokenSyncService, ITokenSyncHandler } from './TokenSyncService';

const SESSION_KEY = 'session';

export class SessionStore implements ISessionStore, ITokenSyncHandler {
  accessToken: string | null = null;
  expiresAt: number | null = null;
  private tokenSyncService: TokenSyncService;
  private isUpdatingFromSync = false;
  private onTokenReceivedFromOtherTab?: () => void;
  private onTokenClearedFromOtherTab?: () => void;

  constructor() {
    this.tokenSyncService = new TokenSyncService();
    this.tokenSyncService.setHandler(this);

    this.loadTokenFromStorage();

    makeObservable(this, {
      accessToken: observable,
      expiresAt: observable,
      isAuthenticated: computed,
      isTokenExpired: computed,
      setAccessToken: action,
      clearTokens: action,
      onTokenReceived: action,
      onTokenCleared: action,
    });
  }

  private loadTokenFromStorage = () => {
    const sessionData = localStorage.getItem(SESSION_KEY);

    if (sessionData) {
      try {
        const { accessToken, expiresAt } = JSON.parse(sessionData);

        if (accessToken && expiresAt) {
          this.accessToken = accessToken;
          this.expiresAt = expiresAt;
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  };

  private saveTokenToStorage = (token: string | null, expiresAt: number | null) => {
    if (token && expiresAt) {
      const sessionData = JSON.stringify({ accessToken: token, expiresAt });

      localStorage.setItem(SESSION_KEY, sessionData);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  };

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  get isTokenExpired(): boolean {
    if (!this.expiresAt) {
      return true;
    }

    return Date.now() >= this.expiresAt * 1000;
  }

  setAccessToken = (accessToken: string | null) => {
    if (!accessToken) {
      this.clearTokens();

      return;
    }

    try {
      const decoded = jwtDecode(accessToken);
      const expiresAt = decoded.exp;

      this.accessToken = accessToken;
      this.expiresAt = expiresAt || null;

      if (!this.isUpdatingFromSync) {
        this.saveTokenToStorage(accessToken, expiresAt || null);
      }
    } catch {
      this.clearTokens();
    }
  };

  clearTokens = () => {
    this.accessToken = null;
    this.expiresAt = null;

    if (!this.isUpdatingFromSync) {
      this.saveTokenToStorage(null, null);
    }
  };

  onTokenReceived = (accessToken: string | null, expiresAt: number | null) => {
    if (accessToken && !this.isTokenValid(accessToken, expiresAt)) {
      return;
    }

    this.isUpdatingFromSync = true;

    this.accessToken = accessToken;
    this.expiresAt = expiresAt;

    this.isUpdatingFromSync = false;

    if (this.onTokenReceivedFromOtherTab && accessToken) {
      this.onTokenReceivedFromOtherTab();
    }
  };

  onTokenCleared = () => {
    this.isUpdatingFromSync = true;

    this.accessToken = null;
    this.expiresAt = null;

    this.isUpdatingFromSync = false;

    if (this.onTokenClearedFromOtherTab) {
      this.onTokenClearedFromOtherTab();
    }
  };

  setOnTokenReceivedFromOtherTabCallback = (callback: () => void) => {
    this.onTokenReceivedFromOtherTab = callback;
  };

  setOnTokenClearedFromOtherTabCallback = (callback: () => void) => {
    this.onTokenClearedFromOtherTab = callback;
  };

  private isTokenValid = (token: string, expiresAt: number | null): boolean => {
    try {
      jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (expiresAt && expiresAt < currentTime) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  destroy = () => {
    this.tokenSyncService.destroy();
  };
}
