import type { IUser, ISessionStore, IUserStore, IApi, IAuthService } from '@repo/types';
import { action, makeObservable, runInAction } from 'mobx';

import { AsyncStateStore } from '../../shared';

import { OAuthApi } from './OAuthApi';
import { TokenTimer } from './TokenTimer';

export class AuthService implements IAuthService {
  private sessionStore: ISessionStore;
  private userStore: IUserStore;

  private tokenTimer: TokenTimer;
  private oAuthApi: OAuthApi<IUser>;
  private isInitialized = false;

  asyncState: AsyncStateStore;

  constructor({ sessionStore, userStore, api }: { sessionStore: ISessionStore; userStore: IUserStore; api: IApi }) {
    this.sessionStore = sessionStore;
    this.userStore = userStore;
    this.tokenTimer = new TokenTimer(this, {
      checkInterval: 60 * 1000,
      refreshBeforeExpiry: 1 * 60,
    });
    this.asyncState = new AsyncStateStore();
    this.oAuthApi = new OAuthApi<IUser>({ api });

    makeObservable(this, {
      checkStatus: action,
      refreshToken: action,
      logout: action,
      loginWithGoogle: action,
      init: action,
      onTokenExpiringSoon: action,
      onTokenExpired: action,
      getExpirationTime: action,
      getGoogleAuthUrl: action,
      handleGoogleCallback: action,
      getCurrentUser: action,
      handleTokenFromOtherTab: action,
      handleTokenClearedFromOtherTab: action,
    });

    this.sessionStore.setOnTokenReceivedFromOtherTabCallback(this.handleTokenFromOtherTab);
    this.sessionStore.setOnTokenClearedFromOtherTabCallback(this.handleTokenClearedFromOtherTab);

    this.init();
  }

  init = async () => {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;
    this.asyncState.setLoadedStart();
    try {
      await this.checkStatus();
      this.asyncState.setLoadedSuccess();
    } catch (error) {
      // TODO: handle error

      // eslint-disable-next-line no-console
      console.error(error);

      this.asyncState.setLoadedError(error);
    }
  };

  onTokenExpiringSoon = async (): Promise<void> => {
    await this.refreshToken();
  };

  onTokenExpired = async (): Promise<void> => {
    await this.logout();
  };

  getExpirationTime = (): number | null => {
    return this.sessionStore.expiresAt;
  };

  checkStatus = async (): Promise<boolean> => {
    try {
      const response = await this.oAuthApi.checkStatus();
      const { authenticated, user } = response.data;

      if (!authenticated) {
        const token = await this.refreshToken();

        if (!token) {
          await this.logout();

          return false;
        }

        try {
          const retryResponse = await this.oAuthApi.checkStatus();
          const { authenticated: retryAuthenticated, user: retryUser } = retryResponse.data;

          if (!retryAuthenticated) {
            await this.logout();

            return false;
          }

          runInAction(() => {
            if (retryUser) {
              this.userStore.setUserApi(retryUser);
            }
          });

          this.tokenTimer.start();

          return true;
        } catch (retryError) {
          // eslint-disable-next-line no-console
          console.error(retryError);
          await this.logout();

          return false;
        }
      }

      const accessToken = runInAction(() => this.sessionStore.accessToken);

      if (!accessToken) {
        await this.refreshToken();
      }

      runInAction(() => {
        if (user) {
          this.userStore.setUserApi(user);
        }
      });

      this.tokenTimer.start();

      return true;
    } catch (error) {
      // TODO: handle error
      // eslint-disable-next-line no-console
      console.error(error);

      runInAction(() => {
        this.tokenTimer.stop();
        this.userStore.clearUser();
      });

      return false;
    }
  };

  refreshToken = async (): Promise<string | null> => {
    try {
      const response = await this.oAuthApi.refreshToken();
      const { access_token } = response.data;

      if (!access_token) {
        await this.logout();

        return null;
      }

      runInAction(() => {
        this.sessionStore.setAccessToken(access_token);
        this.tokenTimer.restart();
      });

      return access_token;
    } catch (error) {
      // TODO: handle error
      // eslint-disable-next-line no-console
      console.error(error);

      await this.logout();

      return null;
    }
  };

  logout = async (): Promise<void> => {
    this.tokenTimer.stop();

    try {
      await this.oAuthApi.logout();
    } catch (error) {
      // TODO: handle error
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      runInAction(() => {
        this.userStore.clearUser();
        this.sessionStore.clearTokens();
      });
    }
  };

  getGoogleAuthUrl = async (): Promise<string> => {
    const response = await this.oAuthApi.getGoogleAuthUrl();

    if (response.status !== 200) {
      throw new Error('Google Auth URL is not available');
    }

    return response.data.auth_url;
  };

  loginWithGoogle = async (code: string): Promise<void> => {
    const response = await this.oAuthApi.loginWithGoogle(code);

    if (response.status !== 200) {
      throw new Error('Google login failed');
    }

    const { access_token, user } = response.data;

    runInAction(() => {
      this.sessionStore.setAccessToken(access_token);
      this.userStore.setUserApi(user);
      this.tokenTimer.start();
    });
  };

  handleGoogleCallback = async (): Promise<void> => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const accessToken = urlParams.get('access_token');

    if (error) {
      return;
    }

    try {
      if (accessToken) {
        this.sessionStore.setAccessToken(accessToken);
        this.userStore.clearUser();
        await this.checkStatus();
      } else if (code) {
        await this.loginWithGoogle(code);
      }
    } catch (err) {
      // TODO: handle error
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  getCurrentUser = async (): Promise<void> => {
    if (!this.sessionStore.accessToken) {
      if (!this.userStore.user) {
        return;
      }
      await this.refreshToken();
    }

    if (!this.sessionStore.accessToken) {
      return;
    }

    try {
      const response = await this.oAuthApi.getCurrentUser(this.sessionStore.accessToken);

      if (response.status === 200 && response.data) {
        runInAction(() => {
          this.userStore.setUserApi(response.data);
        });
      }
    } catch (error) {
      // TODO: handle error
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  handleTokenFromOtherTab = async (): Promise<void> => {
    if (this.sessionStore.accessToken && !this.userStore.user) {
      try {
        await this.getCurrentUser();
        this.tokenTimer.start();
      } catch (error) {
        // TODO: handle error
        // eslint-disable-next-line no-console
        console.error('Error while getting user from other tab:', error);
      }
    }
  };

  handleTokenClearedFromOtherTab = (): void => {
    runInAction(() => {
      this.userStore.clearUser();
    });
    this.tokenTimer.stop();
  };

  destroy = () => {
    this.tokenTimer.destroy();
    this.sessionStore.destroy();
    this.isInitialized = false;
  };
}
