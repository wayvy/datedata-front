import type { ApiResponse } from '../api';

export interface RefreshResponse {
  access_token: string;
  expires_in?: number;
}

export interface IOAuthApi<TUser> {
  refreshToken: () => Promise<ApiResponse<RefreshResponse>>;
  logout: () => Promise<ApiResponse<void>>;
  getGoogleAuthUrl: () => Promise<ApiResponse<{ auth_url: string }>>;
  exchangeCode: (code: string) => Promise<ApiResponse<RefreshResponse>>;
  getCurrentUser: (token: string) => Promise<ApiResponse<TUser>>;
}
