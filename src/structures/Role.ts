import { Role as APIRole } from 'revolt-api'
import { Base, Server, Overwrite } from './index'
import { UUID, ChannelPermissions } from '../util/index'

export class Role extends Base {
    name!: string
    color: string | null = null
    hoist = false
    rank!: number
    overwrite!: Overwrite
    constructor(public server: Server, data: APIRole & { id: string }) {
        super(server.client)
        this._patch(data)
    }

    protected _patch(data: APIRole & { _id?: string }): this {
        super._patch(data)


        if (data.name) this.name = data.name
        if (typeof data.hoist === 'boolean') this.hoist = data.hoist
        if (typeof data.rank === 'number') this.rank = data.rank
        if ('colour' in data) this.color = data.colour ?? null
        if (data.permissions) {
            const { a, d } = data.permissions
            this.overwrite = { allow: new ChannelPermissions(a), deny: new ChannelPermissions(d) }
        }

        return this
    }

    get createdAt(): Date {
        return UUID.timestampOf(this.id)
    }

    get createdTimestamp(): number {
        return this.createdAt.getTime()
    }

    get permissions(): Overwrite {
        return this.overwrite
    }

    async delete(): Promise<void> {
        await this.server.roles.delete(this)
    }

    toString(): string {
        return `<@&${this.id}>`
    }
}
