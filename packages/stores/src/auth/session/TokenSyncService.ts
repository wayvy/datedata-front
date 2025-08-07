/* eslint-disable no-console */
import { action, makeObservable } from 'mobx';

interface TokenSyncMessage {
  type: 'TOKEN_UPDATE' | 'TOKEN_CLEAR';
  payload?: {
    accessToken: string | null;
    expiresAt: number | null;
  };
}

export interface ITokenSyncHandler {
  onTokenReceived: (accessToken: string | null, expiresAt: number | null) => void;
  onTokenCleared: () => void;
}

export class TokenSyncService {
  private broadcastChannel: BroadcastChannel | null = null;
  private handler: ITokenSyncHandler | null = null;
  private readonly channelName = 'auth-token-sync';

  constructor() {
    makeObservable(this, {
      broadcastTokenUpdate: action,
      broadcastTokenClear: action,
    });

    this.initBroadcastChannel();
  }

  private initBroadcastChannel = () => {
    if (typeof BroadcastChannel === 'undefined') {
      console.warn('BroadcastChannel not supported');

      return;
    }

    try {
      this.broadcastChannel = new BroadcastChannel(this.channelName);
      this.broadcastChannel.addEventListener('message', this.handleBroadcastMessage);
    } catch (error) {
      console.error('Error creating BroadcastChannel:', error);
    }
  };

  private handleBroadcastMessage = (event: MessageEvent<TokenSyncMessage>) => {
    if (!this.handler) {
      return;
    }

    const { type, payload } = event.data;

    switch (type) {
      case 'TOKEN_UPDATE':
        if (payload) {
          this.handler.onTokenReceived(payload.accessToken, payload.expiresAt);
        }
        break;
      case 'TOKEN_CLEAR':
        this.handler.onTokenCleared();
        break;
      default:
        break;
    }
  };

  setHandler = (handler: ITokenSyncHandler) => {
    this.handler = handler;
  };

  broadcastTokenUpdate = (accessToken: string | null, expiresAt: number | null) => {
    if (!this.broadcastChannel) {
      return;
    }

    const message: TokenSyncMessage = {
      type: 'TOKEN_UPDATE',
      payload: {
        accessToken,
        expiresAt,
      },
    };

    try {
      this.broadcastChannel.postMessage(message);
    } catch (error) {
      console.error('Error sending token through BroadcastChannel:', error);
    }
  };

  broadcastTokenClear = () => {
    if (!this.broadcastChannel) {
      return;
    }

    const message: TokenSyncMessage = {
      type: 'TOKEN_CLEAR',
    };

    try {
      this.broadcastChannel.postMessage(message);
    } catch (error) {
      console.error('Error sending token clear through BroadcastChannel:', error);
    }
  };

  destroy = () => {
    if (this.broadcastChannel) {
      this.broadcastChannel.removeEventListener('message', this.handleBroadcastMessage);
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    this.handler = null;
  };
}
