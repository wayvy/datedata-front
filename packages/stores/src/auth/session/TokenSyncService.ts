export interface ITokenSyncHandler {
  onTokenReceived: (accessToken: string | null, expiresAt: number | null) => void;
  onTokenCleared: () => void;
}

const SESSION_KEY = 'session';

export class TokenSyncService {
  private handler: ITokenSyncHandler | null = null;

  constructor() {
    window.addEventListener('storage', this.handleStorageEvent);
  }

  private handleStorageEvent = (event: StorageEvent) => {
    if (!this.handler) {
      return;
    }

    if (event.key === SESSION_KEY) {
      if (event.newValue) {
        try {
          const { accessToken, expiresAt } = JSON.parse(event.newValue);

          if (accessToken && expiresAt) {
            this.handler.onTokenReceived(accessToken, expiresAt);
          } else {
            this.handler.onTokenCleared();
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to parse session data from storage event:', error);
          this.handler.onTokenCleared();
        }
      } else {
        this.handler.onTokenCleared();
      }
    }
  };

  setHandler = (handler: ITokenSyncHandler) => {
    this.handler = handler;
  };

  destroy = () => {
    window.removeEventListener('storage', this.handleStorageEvent);
    this.handler = null;
  };
}
