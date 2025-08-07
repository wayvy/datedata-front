import type { ITokenTimer, ITokenTimerCallbacks, TokenTimerConfig } from '@repo/types';

export class TokenTimer implements ITokenTimer {
  private timer: NodeJS.Timeout | null = null;
  private config: Required<TokenTimerConfig>;
  private callbacks: ITokenTimerCallbacks;
  private isRunning = false;

  constructor(callbacks: ITokenTimerCallbacks, config: TokenTimerConfig) {
    this.callbacks = callbacks;
    this.config = {
      checkInterval: config.checkInterval,
      refreshBeforeExpiry: config.refreshBeforeExpiry,
    };
  }

  start = (): void => {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.scheduleCheck();
  };

  stop = (): void => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  };

  restart = (): void => {
    this.stop();
    this.start();
  };

  private scheduleCheck = (): void => {
    if (!this.isRunning) {
      return;
    }

    this.timer = setTimeout(() => {
      this.checkToken();
      this.scheduleCheck();
    }, this.config.checkInterval);
  };

  private checkToken = async (): Promise<void> => {
    const expirationTime = this.callbacks.getExpirationTime();

    if (!expirationTime) {
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expirationTime - currentTime;

    if (timeUntilExpiry <= this.config.refreshBeforeExpiry) {
      try {
        await this.callbacks.onTokenExpiringSoon();
      } catch (error) {
        // TODO: handle error

        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  };

  destroy = () => {
    this.stop();
  };
}
