/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventEmitter } from 'events'
import { Response } from 'node-fetch'
import { APIRoutes } from 'revolt-api/dist/routes'
import { APIRequest } from './APIRequest'
import { HTTPError } from './HTTPError'
import { parseResponse } from './utils/utils'
import { BaseClient } from '../client/BaseClient'
import { Events } from '../util'

type GetRoutes = Extract<APIRoutes, { method: 'get' }>
type PostRoutes = Extract<APIRoutes, { method: 'post' }>
type DeleteRoutes = Extract<APIRoutes, { method: 'delete' }>
type PatchRoutes = Extract<APIRoutes, { method: 'patch' }>
type PutRoutes = Extract<APIRoutes, { method: 'put' }>

export enum RequestMethod {
    Delete = 'DELETE',
    Get = 'GET',
    Patch = 'PATCH',
    Post = 'POST',
    Put = 'PUT'
}

export interface RequestData {
    body?: unknown
    headers?: Record<string, string>
}

export interface InternalRequest extends RequestData {
    method: RequestMethod
    path: string
}

export interface RESTOptions {
    api: string
    cdn: string
    invite: string
    offset: number
    retries: number
    timeout: number
}

export class REST extends EventEmitter {
    constructor(private client: BaseClient, private options: RESTOptions) {
        super()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async request(options: InternalRequest | APIRequest): Promise<any> {
        const request = options instanceof APIRequest ? options : new APIRequest(this.options.api + options.path)

        if (!(options instanceof APIRequest)) {
            request
                .setMethod(options.method)
                .setBody(options.body)
                .setHeaders(options.headers ?? this.client.headers)
        }

        let res: Response

        try {
            res = await request.execute({ timeout: this.options.timeout })
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
            this.client.emit(
                Events.DEBUG,
                `Hit a 429 while executing a request.
          Method: ${request.method}
          Path: ${request.path}
          Limit: ${this.options.retries}
          Timeout: ${this.options.timeout}ms`
            )
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

    get<Path extends GetRoutes['path']>(path: Path, options: RequestData = {}): Promise<Extract<GetRoutes, { path: Path }>['response']> {
        return this.request({ ...options, path, method: RequestMethod.Get })
    }

    delete<Path extends DeleteRoutes['path']>(path: Path, options: RequestData = {}): Promise<Extract<DeleteRoutes, { path: Path }>['response']> {
        return this.request({ ...options, path, method: RequestMethod.Delete })
    }

    post<Path extends PostRoutes['path']>(path: Path, options: RequestData = {}): Promise<Extract<PostRoutes, { path: Path }>['response']> {
        return this.request({ ...options, path, method: RequestMethod.Post })
    }

    put<Path extends PutRoutes['path']>(path: Path, options: RequestData = {}): Promise<Extract<PutRoutes, { path: Path }>['response']> {
        return this.request({ ...options, path, method: RequestMethod.Put })
    }

    patch<Path extends PatchRoutes['path']>(path: Path, options: RequestData = {}): Promise<Extract<PatchRoutes, { path: Path }>['response']> {
        return this.request({ ...options, path, method: RequestMethod.Patch })
    }
}

declare const rest: REST

rest.get(`/users/${'' as string}`).then(c => {
    c
})
