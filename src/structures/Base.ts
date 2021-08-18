import type { Client } from '..'

export abstract class Base {
    constructor(public client: Client) {}
    abstract _update(data: unknown): this
    abstract _patch(data: unknown): this
    _clone(): this {
        return Object.assign(Object.create(this), this)
    }
}
