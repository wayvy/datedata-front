import { IApi, ISessionStore, ITokenRefreshHandler } from '@repo/types';

import { ApiInterceptor } from './ApiInterceptor';

export class AuthApi implements IApi {
  private sessionStore: ISessionStore;
  private interceptor: ApiInterceptor;

  constructor({
    api,
    sessionStore,
    tokenRefreshHandler,
  }: {
    api: IApi;
    sessionStore: ISessionStore;
    tokenRefreshHandler: ITokenRefreshHandler;
  }) {
    this.sessionStore = sessionStore;
    this.interceptor = new ApiInterceptor(api, tokenRefreshHandler, sessionStore);
  }

  get = async <T = any>(endpoint: string, config: any = {}) => {
    return this.interceptor.get<T>(endpoint, {
      ...config,
      token: this.sessionStore.accessToken || undefined,
    });
  };

  post = async <T = any>(endpoint: string, data?: any, config: any = {}) => {
    return this.interceptor.post<T>(endpoint, data, {
      ...config,
      token: this.sessionStore.accessToken || undefined,
    });
  };

  put = async <T = any>(endpoint: string, data?: any, config: any = {}) => {
    return this.interceptor.put<T>(endpoint, data, {
      ...config,
      token: this.sessionStore.accessToken || undefined,
    });
  };

  delete = async <T = any>(endpoint: string, config: any = {}) => {
    return this.interceptor.delete<T>(endpoint, {
      ...config,
      token: this.sessionStore.accessToken || undefined,
    });
  };
}
