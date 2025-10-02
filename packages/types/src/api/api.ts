export type ApiConfig = {
  baseURL: string;
  timeout?: number;
};

export type RequestConfig = RequestInit & {
  timeout?: number;
};

export type ApiResponse<T = any> = {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
};

export interface IApi {
  get: <T>(endpoint: string, config?: RequestConfig) => Promise<ApiResponse<T>>;
  post: <T>(endpoint: string, data?: any, config?: RequestConfig) => Promise<ApiResponse<T>>;
  put: <T>(endpoint: string, data?: any, config?: RequestConfig) => Promise<ApiResponse<T>>;
  delete: <T>(endpoint: string, config?: RequestConfig) => Promise<ApiResponse<T>>;
}
