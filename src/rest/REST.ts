/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventEmitter } from 'events'
import fetch from 'node-fetch'
import { BaseClient } from '../client/BaseClient'
import { DEFUALT_REST_OPTIONS } from '../util/Constants'
import { InternalRequest, RequestData, RequestMethod, RouteLike } from './RequestManager'
import { parseResponse } from './utils/utils'

export interface RESTOptions {
    api: string
    cdn: string
    offset: number
    retries: number
    timeout: number
}

export class REST extends EventEmitter {
    public options: RESTOptions

    constructor(private client: BaseClient, options: Partial<RESTOptions> = {}) {
        super()
        this.options = { ...DEFUALT_REST_OPTIONS, ...options }
    }

    public get(route: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, route, method: RequestMethod.Get })
    }

    public delete(route: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, route, method: RequestMethod.Delete })
    }

    public post(route: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, route, method: RequestMethod.Post })
    }

    public put(route: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, route, method: RequestMethod.Put })
    }

    public patch(route: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, route, method: RequestMethod.Patch })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public request({ method, headers, body, route }: InternalRequest): Promise<any> {
        return fetch(this.options.api + route, {
            method,
            headers: (headers ?? this.client.headers) as Record<string, string>,
            body: (body && JSON.stringify(body)) as string
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Path: ${route} | Status: ${response.statusText} | Code: ${response.status}`)
            }
            return parseResponse(response)
        })
    }
}
