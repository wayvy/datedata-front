import type { RequestConfig, ApiResponse, IApi } from '../api';

export interface IAuthApi extends IApi {
  get: <T = any>(endpoint: string, config?: RequestConfig & { token?: string }) => Promise<ApiResponse<T>>;
  post: <T = any>(endpoint: string, data?: any, config?: RequestConfig & { token?: string }) => Promise<ApiResponse<T>>;
  put: <T = any>(endpoint: string, data?: any, config?: RequestConfig & { token?: string }) => Promise<ApiResponse<T>>;
  delete: <T = any>(endpoint: string, config?: RequestConfig & { token?: string }) => Promise<ApiResponse<T>>;
}
