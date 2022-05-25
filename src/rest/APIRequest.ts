import fetch, { Response, HeadersInit } from 'node-fetch'

export interface APIRequestOptions {
    method?: RequestMethod
    body?: unknown
    headers?: HeadersInit
    timeout?: number
}

export enum RequestMethod {
    Delete = 'DELETE',
    Get = 'GET',
    Patch = 'PATCH',
    Post = 'POST',
    Put = 'PUT'
}

export class APIRequest {
    body?: unknown
    headers?: HeadersInit
    method = RequestMethod.Get
    retries = 0
    timeout: number
    constructor(public path: string, { method, headers, body, timeout }: APIRequestOptions = {}) {
        this.method = method ?? this.method
        this.body = body
        this.headers = headers
        this.timeout = timeout ?? 0
    }

    execute(): Promise<Response> {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), this.timeout).unref()
        return fetch(this.path, {
            method: this.method,
            body: this.body ? JSON.stringify(this.body) : null,
            headers: this.headers,
            signal: controller.signal
        }).finally(() => clearTimeout(timeout))
    }
}
