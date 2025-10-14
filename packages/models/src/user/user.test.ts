import type { UserApi } from '@repo/types';
import { describe, it, expect } from 'vitest';

import { UserModel } from './user';

describe('UserModel', () => {
  const createMockUserApi = (overrides: Partial<UserApi> = {}): UserApi => ({
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/avatar.jpg',
    ...overrides,
  });

  describe('constructor', () => {
    it('should create UserModel instance with valid UserApi data', () => {
      const userApi = createMockUserApi();
      const userModel = new UserModel(userApi);

      expect(userModel).toBeInstanceOf(UserModel);
      expect(userModel.id).toBe('user-123');
      expect(userModel.email).toBe('test@example.com');
      expect(userModel.name).toBe('Test User');
      expect(userModel.avatar).toBe('https://example.com/avatar.jpg');
    });

    it('should assign all properties correctly from UserApi', () => {
      const userApi = createMockUserApi({
        id: 'unique-id-456',
        email: 'john.doe@company.com',
        name: 'John Doe',
        picture: 'https://cdn.example.com/profile.png',
      });

      const userModel = new UserModel(userApi);

      expect(userModel.id).toBe('unique-id-456');
      expect(userModel.email).toBe('john.doe@company.com');
      expect(userModel.name).toBe('John Doe');
      expect(userModel.avatar).toBe('https://cdn.example.com/profile.png');
    });

    it('should set avatar to empty string when picture is undefined', () => {
      const userApi = createMockUserApi({
        picture: undefined,
      });

      const userModel = new UserModel(userApi);

      expect(userModel.avatar).toBe('');
    });

    it('should handle empty string values', () => {
      const userApi = createMockUserApi({
        id: '',
        email: '',
        name: '',
        picture: '',
      });

      const userModel = new UserModel(userApi);

      expect(userModel.id).toBe('');
      expect(userModel.email).toBe('');
      expect(userModel.name).toBe('');
      expect(userModel.avatar).toBe('');
    });
  });
});
