import type { IDestroyable } from '@repo/types';

import type { ITokenRefreshHandler, ITokenTimerCallbacks } from './token-timer';

export interface IAuthService extends ITokenRefreshHandler, ITokenTimerCallbacks, IDestroyable {}
