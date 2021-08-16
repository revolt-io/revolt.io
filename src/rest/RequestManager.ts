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

export class RequestManager {
    #queue = []
}
