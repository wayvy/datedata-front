import type { ApiResponse } from '@repo/types';

export interface AuthResponse<TUser> {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user: TUser;
}

export interface RefreshResponse {
  access_token: string;
  expires_in?: number;
}

export interface StatusResponse<TUser> {
  authenticated: boolean;
  user?: TUser;
}

export interface IOAuthApi<TUser> {
  checkStatus: () => Promise<ApiResponse<StatusResponse<TUser>>>;
  refreshToken: () => Promise<ApiResponse<RefreshResponse>>;
  logout: () => Promise<ApiResponse<void>>;
  getGoogleAuthUrl: () => Promise<ApiResponse<{ auth_url: string }>>;
  loginWithGoogle: (code: string) => Promise<ApiResponse<AuthResponse<TUser>>>;
  getCurrentUser: (token: string) => Promise<ApiResponse<TUser>>;
}
