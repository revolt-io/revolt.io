import type { Client } from '..'

type ID = { _id: string } | { id: string } | { _id: { user: string } }

export abstract class Base<APIBase extends Partial<ID> = Partial<ID>> {
    id!: string
    constructor(public client: Client) {}

    _update(data: APIBase): this {
        const clone = this._clone()
        clone._patch(data)
        return clone
    }

    protected _patch(data: APIBase): this {
        if ('id' in data) this.id = data.id!
        if ('_id' in data) {
            if (typeof data._id === 'string') this.id = data._id
            if (typeof data._id === 'object') this.id = data._id.user
        }
        return this
    }

    protected _clone(): this {
        return Object.assign(Object.create(this), this)
    }
}
