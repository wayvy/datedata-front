import type { IDestroyable } from '../shared';

import type { ITokenRefreshHandler } from './token';

export interface IAuthService extends ITokenRefreshHandler, IDestroyable {}
