import { Server as RawServer } from 'revolt-api/types/Servers'
import { Client, RoleManager, UUID } from '..'
import { ServerChannelManager, ServerMemberManager } from '../managers'
import { User, Base } from '.'
import { Role as RawRole } from 'revolt-api/types/Servers'

export class Server extends Base {
    name!: string
    id!: string
    description!: string | null
    ownerId!: string
    members = new ServerMemberManager(this)
    channels: ServerChannelManager
    roles: RoleManager
    _channels: string[] = []
    _roles: Record<string, RawRole> = {}
    deleted = false

    constructor(client: Client, data: RawServer) {
        super(client)
        this._patch(data)
        this.channels = new ServerChannelManager(this)
        this.roles = new RoleManager(this)
    }

    get createdAt(): Date {
        return UUID.extrectTime(this.id)
    }

    get createdTimestamp(): number {
        return this.createdAt.getTime()
    }

    _patch(data: RawServer): this {
        if (data._id) {
            this.id = data._id
        }

        if (data.owner) {
            this.ownerId = data.owner
        }

        if (data.name) {
            this.name = data.name
        }

        if ('description' in data) {
            this.description = data.description ?? null
        }

        if (Array.isArray(data.channels)) {
            this._channels = data.channels
        }

        if (typeof data.roles === 'object') {
            this._roles = data.roles
        }

        return this
    }

    _update(data: RawServer): this {
        const clone = this._clone()
        clone._patch(data)
        return clone
    }

    get owner(): User | null {
        return this.client.users.cache.get(this.ownerId) ?? null
    }

    async ack(): Promise<void> {
        await this.client.servers.ack(this)
    }

    async delete(): Promise<void> {
        await this.client.servers.delete(this)
    }

    toString(): string {
        return this.name
    }
}
