import { IUser, UserApi } from '@repo/types';

export class UserModel implements IUser {
  id: string;
  email: string;
  name: string;
  avatar: string;

  constructor(userApi: UserApi) {
    this.id = userApi.id;
    this.email = userApi.email;
    this.name = userApi.name;
    this.avatar = userApi.picture || '';
  }
}
