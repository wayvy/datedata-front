import type { ISessionStore } from '@repo/types';
import { jwtDecode } from 'jwt-decode';
import { makeObservable, action, observable, computed } from 'mobx';

import { TokenSyncService, ITokenSyncHandler } from './TokenSyncService';

export class SessionStore implements ISessionStore, ITokenSyncHandler {
  accessToken: string | null = null;
  expiresAt: number | null = null;
  private tokenSyncService: TokenSyncService;
  private isUpdatingFromBroadcast = false;
  private onTokenReceivedFromOtherTab?: () => void;
  private onTokenClearedFromOtherTab?: () => void;

  constructor() {
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

    this.tokenSyncService = new TokenSyncService();
    this.tokenSyncService.setHandler(this);
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  get isTokenExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }

    return Date.now() >= this.expiresAt * 1000;
  }

  setAccessToken = (accessToken: string | null) => {
    this.accessToken = accessToken;
    if (!accessToken) {
      return;
    }

    const expiresAt = jwtDecode(accessToken).exp;

    if (expiresAt) {
      this.expiresAt = expiresAt;
    }

    if (!this.isUpdatingFromBroadcast) {
      this.tokenSyncService.broadcastTokenUpdate(accessToken, expiresAt || null);
    }
  };

  clearTokens = () => {
    this.accessToken = null;
    this.expiresAt = null;

    if (!this.isUpdatingFromBroadcast) {
      this.tokenSyncService.broadcastTokenClear();
    }
  };

  onTokenReceived = (accessToken: string | null, expiresAt: number | null) => {
    this.isUpdatingFromBroadcast = true;

    this.accessToken = accessToken;
    this.expiresAt = expiresAt;

    this.isUpdatingFromBroadcast = false;

    if (this.onTokenReceivedFromOtherTab && accessToken) {
      this.onTokenReceivedFromOtherTab();
    }
  };

  onTokenCleared = () => {
    this.isUpdatingFromBroadcast = true;

    this.accessToken = null;
    this.expiresAt = null;

    this.isUpdatingFromBroadcast = false;

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

  destroy = () => {
    this.tokenSyncService.destroy();
  };
}
