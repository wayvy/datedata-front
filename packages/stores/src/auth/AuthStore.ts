import { Api } from '@repo/models';
import type { IUser } from '@repo/types';
import { computed, makeObservable } from 'mobx';

import { AuthApi } from './auth-api';
import { AuthService } from './auth-service';
import { SessionStore } from './session';
import { UserStore } from './user';

export class AuthStore {
  readonly sessionStore: SessionStore;
  readonly userStore: UserStore;
  readonly api: Api;
  readonly authService: AuthService;
  readonly authApi: AuthApi;

  get user(): IUser | null {
    return this.userStore.user;
  }

  constructor(baseURL: string) {
    this.sessionStore = new SessionStore();
    this.userStore = new UserStore();
    this.api = new Api({ baseURL });
    this.authService = new AuthService({
      api: this.api,
      sessionStore: this.sessionStore,
      userStore: this.userStore,
    });
    this.authApi = new AuthApi({
      api: this.api,
      sessionStore: this.sessionStore,
      tokenRefreshHandler: this.authService,
    });

    makeObservable(this, {
      user: computed,
    });
  }

  destroy = () => {
    this.authService.destroy();
  };
}
