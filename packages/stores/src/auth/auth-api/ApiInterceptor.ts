import type { ApiResponse, IApi, RequestConfig, ITokenRefreshHandler } from '@repo/types';

export class ApiInterceptor implements IApi {
  private api: IApi;
  private tokenRefreshHandler: ITokenRefreshHandler;

  private refreshPromise: Promise<string | null> | null = null;

  constructor(api: IApi, tokenRefreshHandler: ITokenRefreshHandler) {
    this.api = api;
    this.tokenRefreshHandler = tokenRefreshHandler;
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
    config: RequestConfig & { token?: string } = {},
  ): Promise<ApiResponse<T>> => {
    const { token, ...requestConfig } = config;

    if (token) {
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${token}`,
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
      if (this.isAuthError(error)) {
        return this.handleAuthError<T>(endpoint, { ...config, method, data });
      }
      throw error;
    }
  };

  private handleAuthError = async <T = any>(
    endpoint: string,
    originalConfig: RequestConfig & { token?: string; method?: string; data?: any },
  ): Promise<ApiResponse<T>> => {
    if (!this.refreshPromise) {
      this.refreshPromise = this.tokenRefreshHandler.refreshToken();
    }

    try {
      const newToken = await this.refreshPromise;

      this.refreshPromise = null;

      if (!newToken) {
        this.tokenRefreshHandler.onTokenExpired();
        throw new Error('Token refresh failed');
      }

      const { method = 'GET', data, ...config } = originalConfig;

      return this.makeRequest<T>(method, endpoint, data, { ...config, token: newToken });
    } catch (refreshError) {
      this.refreshPromise = null;
      this.tokenRefreshHandler.onTokenExpired();
      throw refreshError;
    }
  };

  private isAuthError = (error: any): boolean => {
    return error?.status === 401 || error?.status === 403;
  };
}
