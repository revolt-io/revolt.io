/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Response } from 'node-fetch'
import type { APIRoutes } from 'revolt-api/dist/routes'
import { APIRequest, APIRequestOptions, RequestMethod } from './APIRequest'
import { HTTPError } from './HTTPError'
import { BaseClientOptions } from '../client/BaseClient'

type GetRoutes = Extract<APIRoutes, { method: 'get' }>
type PostRoutes = Extract<APIRoutes, { method: 'post' }>
type DeleteRoutes = Extract<APIRoutes, { method: 'delete' }>
type PatchRoutes = Extract<APIRoutes, { method: 'patch' }>
type PutRoutes = Extract<APIRoutes, { method: 'put' }>

export const parseResponse = (res: Response): Promise<unknown> => {
    if (res.headers.get('Content-Type')?.startsWith('application/json')) {
        return res.json()
    }
    return res.arrayBuffer()
}

export type RESTOptions = BaseClientOptions['rest']

export class REST {
    #token: string | null = null
    #bot = true

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    debug(_message: string) {}
    constructor(private readonly options: RESTOptions) {}

    setToken(token: string | null, bot = true): this {
        this.#token = token
        this.#bot = bot
        return this
    }

    private get headers() {
        if (!this.#token) return {}
        return {
            [`x-${this.#bot ? 'bot' : 'session'}-token`]: this.#token
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async request(request: APIRequest): Promise<any> {
        let res: Response

        try {
            res = await request.execute()
        } catch (error) {
            if (request.retries === this.options.retries) {
                if (error instanceof Response) {
                    throw new HTTPError(error.statusText, error.constructor.name, error.status, request)
                }
            }

            request.retries++
            return this.request(request)
        }

        if (res.ok) {
            return parseResponse(res)
        }

        // TODO: Handle ratelimit
        if (res.status === 429) {
            this.debug(`Hit a 429 while executing a request.
          Method: ${request.method}
          Path: ${request.path}
          Limit: ${this.options.retries}
          Timeout: ${this.options.timeout}ms`)
        }

        if (res.status >= 500 && res.status < 600) {
            if (request.retries === this.options.retries) {
                throw new HTTPError(res.statusText, res.constructor.name, res.status, request)
            }

            request.retries++

            return this.request(request)
        }

        throw new HTTPError(res.statusText, res.constructor.name, res.status, request)
    }

    private getOptions(options: APIRequestOptions, method: RequestMethod) {
        return {
            ...options,
            headers: this.headers,
            timeout: this.options.timeout,
            method
        }
    }

    get<Path extends GetRoutes['path']>(path: Path, options: APIRequestOptions = {}): Promise<Extract<GetRoutes, { path: Path }>['response']> {
        return this.request(new APIRequest(this.options.url + path, this.getOptions(options, RequestMethod.Get)))
    }

    delete<Path extends DeleteRoutes['path']>(
        path: Path,
        options: APIRequestOptions = {}
    ): Promise<Extract<DeleteRoutes, { path: Path }>['response']> {
        return this.request(new APIRequest(this.options.url + path, this.getOptions(options, RequestMethod.Delete)))
    }

    post<Path extends PostRoutes['path']>(path: Path, options: APIRequestOptions = {}): Promise<Extract<PostRoutes, { path: Path }>['response']> {
        return this.request(new APIRequest(this.options.url + path, this.getOptions(options, RequestMethod.Post)))
    }

    put<Path extends PutRoutes['path']>(path: Path, options: APIRequestOptions = {}): Promise<Extract<PutRoutes, { path: Path }>['response']> {
        return this.request(new APIRequest(this.options.url + path, this.getOptions(options, RequestMethod.Put)))
    }

    patch<Path extends PatchRoutes['path']>(path: Path, options: APIRequestOptions = {}): Promise<Extract<PatchRoutes, { path: Path }>['response']> {
        return this.request(new APIRequest(this.options.url + path, this.getOptions(options, RequestMethod.Patch)))
    }
}
