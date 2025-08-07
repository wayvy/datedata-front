export interface ISessionStore {
  accessToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  isTokenExpired: boolean;
  setAccessToken: (accessToken: string | null) => void;
  clearTokens: () => void;
  setOnTokenReceivedFromOtherTabCallback: (callback: () => void) => void;
  setOnTokenClearedFromOtherTabCallback: (callback: () => void) => void;
  destroy: () => void;
}
