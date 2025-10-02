import type { ApiResponse, IApi, RequestConfig, ITokenRefreshHandler, ISessionStore } from '@repo/types';

export class ApiInterceptor implements IApi {
  private readonly api: IApi;
  private readonly tokenRefreshHandler: ITokenRefreshHandler;
  private readonly sessionStore: ISessionStore;

  constructor(api: IApi, tokenRefreshHandler: ITokenRefreshHandler, sessionStore: ISessionStore) {
    this.api = api;
    this.tokenRefreshHandler = tokenRefreshHandler;
    this.sessionStore = sessionStore;
  }

  get = async <T = any>(endpoint: string, config: RequestConfig & { token?: string } = {}): Promise<ApiResponse<T>> => {
    return this.makeRequest<T>('GET', endpoint, undefined, config);
  };

  post = async <T = any>(
    endpoint: string,
    data?: any,
    config: RequestConfig & { token?: string } = {},
  ): Promise<ApiResponse<T>> => {
    return this.makeRequest<T>('POST', endpoint, data, config);
  };

  put = async <T = any>(
    endpoint: string,
    data?: any,
    config: RequestConfig & { token?: string } = {},
  ): Promise<ApiResponse<T>> => {
    return this.makeRequest<T>('PUT', endpoint, data, config);
  };

  delete = async <T = any>(
    endpoint: string,
    config: RequestConfig & { token?: string } = {},
  ): Promise<ApiResponse<T>> => {
    return this.makeRequest<T>('DELETE', endpoint, undefined, config);
  };

  private makeRequest = async <T = any>(
    method: string,
    endpoint: string,
    data?: any,
    config: RequestConfig & { token?: string; isRetry?: boolean } = {},
  ): Promise<ApiResponse<T>> => {
    const { token, isRetry, ...requestConfig } = config;

    const currentToken = await this.ensureValidToken(token);

    if (currentToken) {
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${currentToken}`,
      };
    }

    try {
      let response: ApiResponse<T>;

      switch (method) {
        case 'GET':
          response = await this.api.get<T>(endpoint, requestConfig);
          break;
        case 'POST':
          response = await this.api.post<T>(endpoint, data, requestConfig);
          break;
        case 'PUT':
          response = await this.api.put<T>(endpoint, data, requestConfig);
          break;
        case 'DELETE':
          response = await this.api.delete<T>(endpoint, requestConfig);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return response;
    } catch (error: any) {
      if (this.isAuthError(error) && !isRetry) {
        return this.handleAuthError<T>(endpoint, { ...config, method, data });
      }
      throw error;
    }
  };

  private handleAuthError = async <T = any>(
    endpoint: string,
    originalConfig: RequestConfig & { token?: string; method?: string; data?: any },
  ): Promise<ApiResponse<T>> => {
    try {
      const newToken = await this.tokenRefreshHandler.refreshToken();

      if (!newToken) {
        if (this.isNetworkError()) {
          throw new Error('Network error during token refresh - session preserved');
        }
        await this.tokenRefreshHandler.onTokenExpired();
        throw new Error('Token refresh failed');
      }

      const { method = 'GET', data, ...config } = originalConfig;

      return this.makeRequest<T>(method, endpoint, data, { ...config, token: newToken, isRetry: true });
    } catch (error: any) {
      if (this.isNetworkError(error)) {
        throw new Error('Network error during token refresh - session preserved');
      }
      throw error;
    }
  };

  private isAuthError = (error: any): boolean => {
    return error?.status === 401;
  };

  private isNetworkError = (error?: any): boolean => {
    if (!navigator.onLine) {
      return true;
    }

    if (error) {
      return (
        error?.name === 'TypeError' ||
        error?.name === 'AbortError' ||
        error?.message?.includes('fetch') ||
        error?.message?.includes('network') ||
        error?.status >= 500 ||
        error?.status === 0
      );
    }

    return false;
  };

  private ensureValidToken = async (providedToken?: string): Promise<string | null> => {
    try {
      if (providedToken) {
        return providedToken;
      }

      const currentToken = this.sessionStore.accessToken;

      if (!currentToken) {
        return null;
      }

      const isTokenExpiringSoon = this.tokenRefreshHandler.isTokenExpiringSoon?.();

      if (this.sessionStore.isTokenExpired || isTokenExpiringSoon) {
        const newToken = await this.tokenRefreshHandler.refreshToken();

        return newToken || null;
      }

      return currentToken;
    } catch {
      return null;
    }
  };
}
