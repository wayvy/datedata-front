import { IApi } from '@repo/types';
import { action, makeObservable } from 'mobx';

import { AsyncStateStore, OpenStateStore } from '../../shared';

interface CreateCalendarData {
  summary: string;
  description?: string;
  color: string;
}

interface CreateCalendarStoreConfig {
  api: IApi;
  onCreateClose: () => Promise<void>;
}

interface CreateCalendarResponse {
  status: number;
  data?: any;
}

export class CreateCalendarStore {
  private readonly _api: IApi;
  private readonly _onCreateCloseCallback: () => Promise<void>;

  readonly openState = new OpenStateStore();
  readonly asyncState = new AsyncStateStore();

  constructor({ api, onCreateClose }: CreateCalendarStoreConfig) {
    this._api = api;
    this._onCreateCloseCallback = onCreateClose;

    makeObservable(this, {
      fetchCreate: action,
    });
  }

  fetchCreate = async (data: CreateCalendarData): Promise<void> => {
    this.asyncState.setLoadedStart();

    try {
      const response = await this._createCalendarRequest(data);

      if (this._isSuccessResponse(response)) {
        await this._handleSuccessfulCreation();
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      this._handleCreationError(error);
    }
  };

  private _createCalendarRequest = async (data: CreateCalendarData): Promise<CreateCalendarResponse> => {
    return await this._api.post('/calendars', {
      summary: data.summary,
      description: data.description,
      color: data.color,
    });
  };

  private _isSuccessResponse = (response: CreateCalendarResponse): boolean => {
    return response.status === 201;
  };

  private _handleSuccessfulCreation = async (): Promise<void> => {
    this.openState.close();
    await this._onCreateCloseCallback();
    this.asyncState.setLoadedSuccess();
  };

  private _handleCreationError = (error: unknown): void => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    this.asyncState.setLoadedError(errorMessage);
  };
}
