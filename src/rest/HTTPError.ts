import { APIRequest } from './APIRequest'
import { RequestMethod } from './REST'

export class HTTPError extends Error {
    code: number
    method: RequestMethod
    path: string
    constructor(message: string, name: string, code: number, request: APIRequest) {
        super(message)
        this.name = name
        this.code = code ?? 500
        this.method = request.method
        this.path = request.path
    }
}
