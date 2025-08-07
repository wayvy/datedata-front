import type { IUser, UserApi } from '@repo/types';

export interface IUserStore {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
  setUserApi: (userApi: UserApi) => void;
}
