export interface ITokenRefreshHandler {
  refreshToken(): Promise<string | null>;
  onTokenExpired(): Promise<void>;
  isTokenExpiringSoon?(): boolean;
  isRefreshingToken?: boolean;
}
