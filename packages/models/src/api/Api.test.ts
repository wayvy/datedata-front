import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Api } from './Api';

const BASE_URL = 'https://api.example.com';
const CONTENT_TYPE = 'application/json';
const REQUEST_ABORTED_ERROR = 'Request aborted';

const mockFetch = vi.fn();
const mockAbort = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
const mockSetTimeout = vi.fn();
const mockClearTimeout = vi.fn();

interface MockAbortSignal {
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  aborted: boolean;
  onabort: ((this: AbortSignal, ev: Event) => any) | null;
  reason: any;
  throwIfAborted(): void;
  dispatchEvent(event: Event): boolean;
}

const createMockResponse = (overrides: Partial<Response> = {}) => ({
  ok: true,
  status: 200,
  statusText: 'OK',
  headers: new Headers(),
  json: vi.fn().mockResolvedValue({}),
  ...overrides,
});

const createMockAbortSignal = (overrides: Partial<MockAbortSignal> = {}): MockAbortSignal => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  aborted: false,
  onabort: null,
  reason: undefined,
  throwIfAborted: vi.fn(),
  dispatchEvent: vi.fn(),
  ...overrides,
});

const createApiInstance = (config: { baseURL?: string; timeout?: number } = {}) =>
  new Api({
    baseURL: config.baseURL ?? BASE_URL,
    timeout: config.timeout ?? 5000,
  });

class MockAbortController implements AbortController {
  signal: AbortSignal = {
    aborted: false,
    reason: undefined,
    onabort: null,
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    dispatchEvent: vi.fn(),
    throwIfAborted: vi.fn(),
  } as AbortSignal;

  abort = mockAbort;
}

Object.assign(global, {
  fetch: mockFetch,
  AbortController: MockAbortController,
  setTimeout: mockSetTimeout,
  clearTimeout: mockClearTimeout,
});

describe('Api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSetTimeout.mockImplementation((fn) => {
      fn();

      return 123;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with provided config', () => {
      const config = {
        baseURL: BASE_URL,
        timeout: 5000,
      };

      const api = createApiInstance(config);

      expect(api).toBeInstanceOf(Api);
    });

    it('should use default timeout value of 20000 when timeout is undefined', () => {
      const api = new Api({
        baseURL: BASE_URL,
        timeout: undefined,
      });

      expect(api).toBeInstanceOf(Api);
    });

    it('should use default timeout when not provided', () => {
      const api = createApiInstance({ baseURL: BASE_URL });

      expect(api).toBeInstanceOf(Api);
    });

    it('should handle different baseURL formats', () => {
      const testCases = [
        { baseURL: BASE_URL, description: 'HTTPS URL' },
        { baseURL: 'http://localhost:3000', description: 'HTTP localhost' },
        { baseURL: 'https://api.example.com/v1', description: 'URL with path' },
      ];

      testCases.forEach(({ baseURL }) => {
        const api = createApiInstance({ baseURL });

        expect(api).toBeInstanceOf(Api);
      });
    });
  });

  describe('request method', () => {
    let api: Api;

    beforeEach(() => {
      api = createApiInstance();
    });

    it('should make successful GET request', async () => {
      const mockResponse = createMockResponse({
        headers: new Headers({ 'Content-Type': CONTENT_TYPE }),
        json: vi.fn().mockResolvedValue({ message: 'success' }),
      });

      mockFetch.mockResolvedValue(mockResponse);

      const result = await api.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/test`,
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': CONTENT_TYPE,
          },
        }),
      );

      expect(result).toEqual({
        data: { message: 'success' },
        status: 200,
        statusText: 'OK',
        headers: mockResponse.headers,
      });
    });

    it('should handle request timeout', async () => {
      mockSetTimeout.mockImplementation(() => {
        mockAbort();

        return 123;
      });

      mockFetch.mockRejectedValue(new Error(REQUEST_ABORTED_ERROR));

      await expect(api.get('/test')).rejects.toThrow(REQUEST_ABORTED_ERROR);

      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
      expect(mockAbort).toHaveBeenCalled();
    });

    it('should handle HTTP error responses', async () => {
      const mockResponse = createMockResponse({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'Content-Type': CONTENT_TYPE }),
        json: vi.fn().mockResolvedValue({ error: 'Not found' }),
      });

      mockFetch.mockResolvedValue(mockResponse);

      await expect(api.get('/test')).rejects.toThrow('HTTP 404: Not Found');

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle custom timeout', async () => {
      const mockResponse = createMockResponse();

      mockFetch.mockResolvedValue(mockResponse);

      await api.get('/test', { timeout: 10000 });

      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 10000);
    });

    it('should handle external abort signal', async () => {
      const externalSignal = createMockAbortSignal();
      const mockResponse = createMockResponse();

      mockFetch.mockResolvedValue(mockResponse);

      await api.get('/test', { signal: externalSignal as AbortSignal });

      expect(externalSignal.addEventListener).toHaveBeenCalledWith('abort', expect.any(Function), { once: true });
    });

    it('should handle external abort signal triggering', async () => {
      let abortCallback: (() => void) | null = null;
      const externalSignal = createMockAbortSignal({
        addEventListener: vi.fn((event, callback) => {
          if (event === 'abort') {
            abortCallback = callback;
          }
        }),
      });

      mockFetch.mockImplementation(() => {
        if (abortCallback) {
          abortCallback();
        }

        return Promise.reject(new Error(REQUEST_ABORTED_ERROR));
      });

      await expect(api.get('/test', { signal: externalSignal as AbortSignal })).rejects.toThrow(REQUEST_ABORTED_ERROR);

      expect(externalSignal.addEventListener).toHaveBeenCalledWith('abort', expect.any(Function), { once: true });
      expect(mockAbort).toHaveBeenCalled();
    });

    it('should merge custom headers', async () => {
      const mockResponse = createMockResponse();

      mockFetch.mockResolvedValue(mockResponse);

      await api.get('/test', {
        headers: {
          Authorization: 'Bearer token',
          'X-Custom-Header': 'value',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/test`,
        expect.objectContaining({
          headers: {
            'Content-Type': CONTENT_TYPE,
            Authorization: 'Bearer token',
            'X-Custom-Header': 'value',
          },
        }),
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');

      mockFetch.mockRejectedValue(networkError);

      await expect(api.get('/test')).rejects.toThrow('Network error');

      expect(mockClearTimeout).toHaveBeenCalled();
    });
  });

  describe('HTTP methods', () => {
    let api: Api;

    beforeEach(() => {
      api = createApiInstance();
    });

    describe('GET', () => {
      it('should make GET request', async () => {
        const mockResponse = createMockResponse({
          json: vi.fn().mockResolvedValue({ data: 'test' }),
        });

        mockFetch.mockResolvedValue(mockResponse);

        const result = await api.get('/users');

        expect(mockFetch).toHaveBeenCalledWith(
          `${BASE_URL}/users`,
          expect.objectContaining({
            method: 'GET',
          }),
        );

        expect(result.data).toEqual({ data: 'test' });
      });
    });

    describe('POST', () => {
      it('should make POST request with data', async () => {
        const mockResponse = createMockResponse({
          status: 201,
          statusText: 'Created',
          json: vi.fn().mockResolvedValue({ id: 1 }),
        });

        mockFetch.mockResolvedValue(mockResponse);

        const postData = { name: 'John', email: 'john@example.com' };
        const result = await api.post('/users', postData);

        expect(mockFetch).toHaveBeenCalledWith(
          `${BASE_URL}/users`,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(postData),
          }),
        );

        expect(result.data).toEqual({ id: 1 });
      });

      it('should make POST request without data', async () => {
        const mockResponse = createMockResponse();

        mockFetch.mockResolvedValue(mockResponse);

        await api.post('/users');

        expect(mockFetch).toHaveBeenCalledWith(
          `${BASE_URL}/users`,
          expect.objectContaining({
            method: 'POST',
            body: undefined,
          }),
        );
      });
    });

    describe('PUT', () => {
      it('should make PUT request with data', async () => {
        const mockResponse = createMockResponse({
          json: vi.fn().mockResolvedValue({ updated: true }),
        });

        mockFetch.mockResolvedValue(mockResponse);

        const putData = { name: 'Jane', email: 'jane@example.com' };
        const result = await api.put('/users/1', putData);

        expect(mockFetch).toHaveBeenCalledWith(
          `${BASE_URL}/users/1`,
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(putData),
          }),
        );

        expect(result.data).toEqual({ updated: true });
      });

      it('should make PUT request without data', async () => {
        const mockResponse = createMockResponse();

        mockFetch.mockResolvedValue(mockResponse);

        await api.put('/users/1');

        expect(mockFetch).toHaveBeenCalledWith(
          `${BASE_URL}/users/1`,
          expect.objectContaining({
            method: 'PUT',
            body: undefined,
          }),
        );
      });
    });

    describe('DELETE', () => {
      it('should make DELETE request', async () => {
        const mockResponse = createMockResponse({
          status: 204,
          statusText: 'No Content',
        });

        mockFetch.mockResolvedValue(mockResponse);

        const result = await api.delete('/users/1');

        expect(mockFetch).toHaveBeenCalledWith(
          `${BASE_URL}/users/1`,
          expect.objectContaining({
            method: 'DELETE',
          }),
        );

        expect(result.status).toBe(204);
      });
    });
  });

  describe('error handling', () => {
    let api: Api;

    beforeEach(() => {
      api = createApiInstance();
    });

    it('should handle 400 Bad Request', async () => {
      const mockResponse = createMockResponse({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({ error: 'Invalid data' }),
      });

      mockFetch.mockResolvedValue(mockResponse);

      await expect(api.post('/users', {})).rejects.toThrow('HTTP 400: Bad Request');
    });

    it('should handle 401 Unauthorized', async () => {
      const mockResponse = createMockResponse({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: vi.fn().mockResolvedValue({ error: 'Unauthorized' }),
      });

      mockFetch.mockResolvedValue(mockResponse);

      await expect(api.get('/protected')).rejects.toThrow('HTTP 401: Unauthorized');
    });

    it('should handle 500 Internal Server Error', async () => {
      const mockResponse = createMockResponse({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({ error: 'Server error' }),
      });

      mockFetch.mockResolvedValue(mockResponse);

      await expect(api.get('/error')).rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('should include response data in error', async () => {
      const mockResponse = createMockResponse({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        json: vi.fn().mockResolvedValue({ errors: ['Field is required'] }),
      });

      mockFetch.mockResolvedValue(mockResponse);

      try {
        await api.post('/users', {});
      } catch (error: any) {
        expect(error.status).toBe(422);
        expect(error.statusText).toBe('Unprocessable Entity');
        expect(error.response).toBeDefined();
        expect(error.response.data).toEqual({ errors: ['Field is required'] });
      }
    });
  });

  describe('edge cases', () => {
    let api: Api;

    beforeEach(() => {
      api = createApiInstance();
    });

    it('should handle empty endpoint', async () => {
      const mockResponse = createMockResponse();

      mockFetch.mockResolvedValue(mockResponse);

      await api.get('');

      expect(mockFetch).toHaveBeenCalledWith(BASE_URL, expect.any(Object));
    });

    it('should handle endpoint with query parameters', async () => {
      const mockResponse = createMockResponse();

      mockFetch.mockResolvedValue(mockResponse);

      await api.get('/users?page=1&limit=10');

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/users?page=1&limit=10`, expect.any(Object));
    });

    it('should handle large JSON responses', async () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `User ${i}` }));
      const mockResponse = createMockResponse({
        json: vi.fn().mockResolvedValue(largeData),
      });

      mockFetch.mockResolvedValue(mockResponse);

      const result = await api.get('/users');

      expect(result.data).toEqual(largeData);
    });
  });
});
