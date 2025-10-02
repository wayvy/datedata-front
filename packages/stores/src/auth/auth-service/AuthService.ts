import type { IUser, ISessionStore, IUserStore, IApi, IAuthService } from '@repo/types';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { AsyncStateStore } from '../../shared';

import { OAuthApi } from './OAuthApi';

type PrivateFields = '_isRefreshingToken';

export class AuthService implements IAuthService {
  private readonly sessionStore: ISessionStore;
  private readonly userStore: IUserStore;
  private readonly oAuthApi: OAuthApi<IUser>;

  private initPromise: Promise<void> | null = null;
  private refreshPromise: Promise<string | null> | null = null;
  private isLoggingOut = false;
  private logoutPromise: Promise<void> | null = null;
  private isOnline = true;
  private pendingRequests: Array<() => Promise<void>> = [];
  private _isRefreshingToken = false;

  asyncState: AsyncStateStore;

  constructor({ sessionStore, userStore, api }: { sessionStore: ISessionStore; userStore: IUserStore; api: IApi }) {
    this.sessionStore = sessionStore;
    this.userStore = userStore;
    this.asyncState = new AsyncStateStore();
    this.oAuthApi = new OAuthApi<IUser>({ api });

    makeObservable<this, PrivateFields>(this, {
      _isRefreshingToken: observable,
      refreshToken: action,
      logout: action,
      init: action,
      onTokenExpired: action,
      getExpirationTime: action,
      getGoogleAuthUrl: action,
      handleGoogleCallback: action,
      getCurrentUser: action,
      handleTokenFromOtherTab: action,
      handleTokenClearedFromOtherTab: action,
      isTokenExpiringSoon: action,
      isRefreshingToken: computed,
    });

    this.subscribeToCrossTabEvents();
    this.subscribeToNetworkEvents();
    this.init();
  }

  init = async (): Promise<void> => {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.runInit();

    return this.initPromise;
  };

  refreshToken = async (): Promise<string | null> => {
    if (this.isLoggingOut) {
      return null;
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.isOnline) {
      return new Promise((resolve) => {
        this.pendingRequests.push(async () => {
          const result = await this.refreshToken();

          resolve(result);
        });
      });
    }

    this._isRefreshingToken = true;
    this.refreshPromise = this.runTokenRefresh();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
      this._isRefreshingToken = false;
    }
  };

  onTokenExpired = async (): Promise<void> => {
    if (!this.isLoggingOut) {
      await this.logout();
    }
  };

  isTokenExpiringSoon = (): boolean => {
    const expirationTime = this.getExpirationTime();

    if (!expirationTime) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expirationTime - currentTime;
    const refreshBeforeExpiry = 30;

    return timeUntilExpiry <= refreshBeforeExpiry;
  };

  getExpirationTime = (): number | null => {
    return this.sessionStore.expiresAt;
  };

  get isRefreshingToken(): boolean {
    return this._isRefreshingToken;
  }

  logout = async (): Promise<void> => {
    if (this.isLoggingOut) {
      return this.logoutPromise || Promise.resolve();
    }

    if (this.logoutPromise) {
      return this.logoutPromise;
    }

    this.logoutPromise = this.runLogout();

    try {
      return await this.logoutPromise;
    } finally {
      this.logoutPromise = null;
    }
  };

  getGoogleAuthUrl = async (): Promise<string> => {
    const response = await this.oAuthApi.getGoogleAuthUrl();

    if (response.status !== 200) {
      throw new Error('Google Auth URL is not available');
    }

    return response.data.auth_url;
  };

  handleGoogleCallback = async (): Promise<void> => {
    if (this.isLoggingOut) {
      return;
    }

    const code = this.getAuthCodeFromUrl();

    if (!code) {
      return;
    }

    const accessToken = await this.exchangeCodeForToken(code);

    if (accessToken) {
      this.saveTokenAndStartTracking(accessToken);
      await this.getCurrentUser();
    }
  };

  getCurrentUser = async (): Promise<void> => {
    if (this.isLoggingOut || !this.sessionStore.accessToken) {
      return;
    }

    try {
      await this.fetchUser(this.sessionStore.accessToken);
    } catch (error) {
      if (this.isUnauthorized(error) && !this.isLoggingOut) {
        await this.refreshAndRetryFetchUser();
      } else if (!this.isLoggingOut) {
        throw error;
      }
    }
  };

  handleTokenFromOtherTab = async (): Promise<void> => {
    if (this.isLoggingOut) {
      return;
    }

    if (this.sessionStore.accessToken && !this.userStore.user) {
      if (this.sessionStore.isTokenExpired || this.isTokenExpiringSoon()) {
        await this.refreshToken();
      }

      if (!this.isLoggingOut) {
        await this.getCurrentUser();
      }
    }
  };

  handleTokenClearedFromOtherTab = (): void => {
    if (this.isLoggingOut) {
      return;
    }

    this.clearSession();
  };

  destroy = (): void => {
    this.isLoggingOut = true;
    this.refreshPromise = null;
    this.initPromise = null;
    this.logoutPromise = null;
    this._isRefreshingToken = false;
    this.cleanupNetworkEvents?.();

    this.sessionStore.destroy();
  };

  private runInit = async (): Promise<void> => {
    this.asyncState.setLoadedStart();

    try {
      if (this.hasStoredToken()) {
        await this.restoreSession();
      }

      if (!this.isLoggingOut) {
        this.asyncState.setLoadedSuccess();
      }
    } catch (error) {
      if (!this.isLoggingOut) {
        this.asyncState.setLoadedError(error);
      }
    }
  };

  private hasStoredToken = (): boolean => {
    return !!this.sessionStore.accessToken;
  };

  private restoreSession = async (): Promise<void> => {
    if (this.sessionStore.isTokenExpired) {
      const newToken = await this.refreshToken();

      if (!newToken) {
        return;
      }

      if (!this.isLoggingOut) {
        await this.getCurrentUser();
      }
    } else {
      await this.getCurrentUser();
    }
  };

  private runTokenRefresh = async (): Promise<string | null> => {
    try {
      const response = await this.retryWithBackoff(() => this.oAuthApi.refreshToken(), 3, 1000);

      const accessToken = response.data.access_token;

      if (!accessToken) {
        await this.logoutOnRefreshFail();

        return null;
      }

      this.saveTokenAndRestartTracking(accessToken);

      return accessToken;
    } catch (error: any) {
      if (this.isRetryableError(error)) {
        return null;
      }

      await this.logoutOnRefreshFail();

      return null;
    }
  };

  private logoutOnRefreshFail = async (): Promise<void> => {
    if (!this.isLoggingOut) {
      await this.logout();
    }
  };

  private saveTokenAndRestartTracking = (accessToken: string): void => {
    if (this.isLoggingOut) {
      return;
    }

    runInAction(() => {
      this.sessionStore.setAccessToken(accessToken);
    });
  };
  private fetchUser = async (token: string): Promise<void> => {
    const response = await this.retryWithBackoff(() => this.oAuthApi.getCurrentUser(token), 2, 500);

    if (response.status === 200 && response.data && !this.isLoggingOut) {
      runInAction(() => {
        this.userStore.setUserApi(response.data);
      });
    }
  };

  private refreshAndRetryFetchUser = async (): Promise<void> => {
    const newToken = await this.refreshToken();

    if (!newToken || this.isLoggingOut) {
      return;
    }

    try {
      await this.fetchUser(newToken);
    } catch (error) {
      if (this.isUnauthorized(error) && !this.isLoggingOut) {
        await this.logout();
      }
    }
  };

  private getAuthCodeFromUrl = (): string | null => {
    const isLocalhost = window.location.hostname === 'localhost';
    const queryString = isLocalhost ? window.location.hash.split('?')[1] || '' : window.location.search.substring(1);

    const params = new URLSearchParams(queryString);

    if (params.get('error')) {
      return null;
    }

    return params.get('code');
  };

  private exchangeCodeForToken = async (code: string): Promise<string | null> => {
    const response = await this.oAuthApi.exchangeCode(code);

    if (response.status !== 200 || !response.data.access_token) {
      throw new Error('Failed to exchange code for token');
    }

    return response.data.access_token;
  };

  private saveTokenAndStartTracking = (accessToken: string): void => {
    if (this.isLoggingOut) {
      return;
    }

    runInAction(() => {
      this.sessionStore.setAccessToken(accessToken);
    });
  };

  private runLogout = async (): Promise<void> => {
    this.isLoggingOut = true;

    try {
      await this.oAuthApi.logout();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during logout', error);
    } finally {
      this.clearSession();
      this.isLoggingOut = false;
    }
  };

  private clearSession = (): void => {
    runInAction(() => {
      this.userStore.clearUser();
      this.sessionStore.clearTokens();
    });
  };

  private subscribeToCrossTabEvents = (): void => {
    this.sessionStore.setOnTokenReceivedFromOtherTabCallback(this.handleTokenFromOtherTab);
    this.sessionStore.setOnTokenClearedFromOtherTabCallback(this.handleTokenClearedFromOtherTab);
  };

  private subscribeToNetworkEvents = (): void => {
    this.isOnline = navigator.onLine;

    const handleOnline = () => {
      this.isOnline = true;
      this.processPendingRequests();
    };

    const handleOffline = () => {
      this.isOnline = false;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    this.cleanupNetworkEvents = () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  };

  private cleanupNetworkEvents?: () => void;

  private processPendingRequests = async (): Promise<void> => {
    if (!this.isOnline || this.pendingRequests.length === 0) {
      return;
    }

    const requests = [...this.pendingRequests];

    this.pendingRequests = [];

    for (const request of requests) {
      try {
        await request();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error during pending requests', error);
      }
    }
  };

  private isUnauthorized = (error: any): boolean => {
    return error?.status === 401;
  };

  private isRetryableError = (error: any): boolean => {
    return (
      !navigator.onLine ||
      error?.name === 'TypeError' ||
      error?.name === 'AbortError' ||
      error?.message?.includes('fetch') ||
      error?.message?.includes('network') ||
      error?.status >= 500 ||
      error?.status === 0 ||
      error?.status === 408 ||
      error?.status === 429
    );
  };

  private retryWithBackoff = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
  ): Promise<T> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        if (attempt === maxRetries - 1 || !this.isRetryableError(error)) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retries exceeded');
  };
}
