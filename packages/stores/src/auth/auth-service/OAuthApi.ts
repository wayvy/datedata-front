import type { ApiResponse, IApi, RefreshResponse, IOAuthApi } from '@repo/types';

export class OAuthApi<TUser> implements IOAuthApi<TUser> {
  private api: IApi;

  constructor({ api }: { api: IApi }) {
    this.api = api;
  }

  refreshToken = async (): Promise<ApiResponse<RefreshResponse>> => {
    return this.api.post<RefreshResponse>('/auth/refresh', undefined, {
      credentials: 'include',
    });
  };

  logout = async (): Promise<ApiResponse<void>> => {
    return this.api.post<void>('/auth/logout', undefined, {
      credentials: 'include',
    });
  };

  getGoogleAuthUrl = async (): Promise<ApiResponse<{ auth_url: string }>> => {
    const redirectURI = window.location.origin;

    return this.api.get<{ auth_url: string }>(`/auth/google/url?redirect_uri=${encodeURIComponent(redirectURI)}`);
  };

  exchangeCode = async (code: string): Promise<ApiResponse<RefreshResponse>> => {
    return this.api.post<RefreshResponse>(
      '/auth/google/exchange',
      { code },
      {
        credentials: 'include',
      },
    );
  };

  getCurrentUser = async (token: string): Promise<ApiResponse<TUser>> => {
    return this.api.get<TUser>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
