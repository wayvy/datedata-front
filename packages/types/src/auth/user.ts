import type { IUser, UserApi } from '../user';

export interface IUserStore {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
  setUserApi: (userApi: UserApi) => void;
}
