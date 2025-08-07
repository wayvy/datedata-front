import type { IApi, ApiConfig, RequestConfig, ApiResponse } from '@repo/types';

export class Api implements IApi {
  private baseURL: string;
  private timeout: number;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout ?? 20000;
  }

  private request = async <T = any>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> => {
    const url = `${this.baseURL}${endpoint}`;
    const { timeout = this.timeout, signal: externalAbortSignal, ...requestConfig } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    externalAbortSignal?.addEventListener('abort', () => controller.abort(), { once: true });

    try {
      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...requestConfig.headers,
        },
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      const apiResponse: ApiResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as any;

        error.status = response.status;
        error.statusText = response.statusText;
        error.response = apiResponse;
        throw error;
      }

      return apiResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  get = async <T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  };

  post = async <T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  put = async <T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  delete = async <T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  };
}
