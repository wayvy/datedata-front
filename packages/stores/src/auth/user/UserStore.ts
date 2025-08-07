import { UserModel } from '@repo/models';
import type { IUser, UserApi, IUserStore } from '@repo/types';
import { action, makeObservable, observable } from 'mobx';

export class UserStore implements IUserStore {
  user: IUser | null = null;

  constructor() {
    makeObservable(this, {
      user: observable,
      setUser: action,
      setUserApi: action,
      clearUser: action,
    });
  }

  setUserApi = (userApi: UserApi) => {
    this.user = new UserModel(userApi);
  };

  setUser = (user: IUser | null) => {
    this.user = user;
  };

  clearUser = () => {
    this.user = null;
  };
}
