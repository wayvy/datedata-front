import type { ApiResponse, IApi, AuthResponse, RefreshResponse, StatusResponse, IOAuthApi } from '@repo/types';

export class OAuthApi<TUser> implements IOAuthApi<TUser> {
  private api: IApi;

  constructor({ api }: { api: IApi }) {
    this.api = api;
  }

  checkStatus = async (): Promise<ApiResponse<StatusResponse<TUser>>> => {
    return this.api.get<StatusResponse<TUser>>('/auth/status', {
      credentials: 'include',
    });
  };

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
    return this.api.get<{ auth_url: string }>('/auth/google/url');
  };

  loginWithGoogle = async (code: string): Promise<ApiResponse<AuthResponse<TUser>>> => {
    return this.api.get<AuthResponse<TUser>>(`/auth/google/callback?code=${encodeURIComponent(code)}`, {
      credentials: 'include',
    });
  };

  getCurrentUser = async (token: string): Promise<ApiResponse<TUser>> => {
    return this.api.get<TUser>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
