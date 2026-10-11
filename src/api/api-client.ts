import type { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  constructor(private readonly context: APIRequestContext) {}

  get(path: string, params?: Record<string, string | number>): Promise<APIResponse> {
    return this.context.get(path, { params });
  }

  postForm(path: string, data: Record<string, string>): Promise<APIResponse> {
    return this.context.post(path, { form: data });
  }
}