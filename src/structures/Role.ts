import { Role as APIRole } from 'revolt-api'
import { Base, Server } from '.'
import { UUID } from '../util'

export class Role extends Base {
    name!: string
    color: string | null = null
    constructor(public server: Server, data: APIRole & { id: string }) {
        super(server.client)
        this._patch(data)
    }

    protected _patch(data: APIRole & { _id?: string }): this {
        super._patch(data)
        if (data.name) this.name = data.name
        if ('colour' in data) this.color = data.colour ?? null
        return this
    }

    get createdAt(): Date {
        return UUID.timestampOf(this.id)
    }

    get createdTimestamp(): number {
        return this.createdAt.getTime()
    }

    async delete(): Promise<void> {
        await this.server.roles.delete(this)
    }

    toString(): string {
        return `<@&${this.id}>`
    }
}
