import fetch, { Response, HeadersInit } from 'node-fetch'
import { RequestMethod } from './REST'

export interface APIRequestOptions {
    timeout: number
}

export class APIRequest {
    private body?: string
    private headers?: HeadersInit
    public method: RequestMethod = RequestMethod.Get
    public retries = 0
    constructor(public path: string) {}

    get info(): Record<string, unknown> {
        return {
            retries: this.retries,
            body: JSON.parse(this.body ?? '{}')
        }
    }

    setMethod(method: RequestMethod): this {
        this.method = method
        return this
    }

    setBody(body?: unknown): this {
        this.body = body ? JSON.stringify(body) : undefined
        return this
    }

    setHeaders(headers: HeadersInit): this {
        this.headers = headers
        return this
    }

    execute(options: APIRequestOptions): Promise<Response> {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), options.timeout).unref()
        return fetch(this.path, {
            method: this.method,
            body: this.body,
            headers: this.headers as HeadersInit,
            signal: controller.signal
        }).finally(() => clearTimeout(timeout))
    }
}
