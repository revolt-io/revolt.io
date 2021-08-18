/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventEmitter } from 'events'
import { Response } from 'node-fetch'
import { APIRequest } from './APIRequest'
import { HTTPError } from './HTTPError'
import { parseResponse } from './utils/utils'
import { BaseClient } from '../client/BaseClient'
import { Events } from '../util'

export enum RequestMethod {
    Delete = 'DELETE',
    Get = 'GET',
    Patch = 'PATCH',
    Post = 'POST',
    Put = 'PUT'
}

export type RouteLike = `/${string}`

export interface RequestData {
    body?: unknown
    headers?: Record<string, string>
}

export interface InternalRequest extends RequestData {
    method: RequestMethod
    route: RouteLike
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
        const request = options instanceof APIRequest ? options : new APIRequest(this.options.api + options.route)

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
                throw new HTTPError(error.statusText, error.constructor.name, error.status, request)
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

        return null
    }

    get(route: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, route, method: RequestMethod.Get })
    }

    delete(route: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, route, method: RequestMethod.Delete })
    }

    post(route: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, route, method: RequestMethod.Post })
    }

    put(route: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, route, method: RequestMethod.Put })
    }

    patch(route: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, route, method: RequestMethod.Patch })
    }
}
