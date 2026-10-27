import { api, setAuthToken } from './api';
import { User } from '../types';

export const authService = {
  async loginOAuth2(username: string, password?: string): Promise<User> {
    const response = await api.login({ username, password });
    setAuthToken(response.access_token);
    return response.user;
  },

  async logout(): Promise<void> {
    setAuthToken(null);
  },

  async getProfile(): Promise<User> {
    return api.getCurrentUser();
  }
};
