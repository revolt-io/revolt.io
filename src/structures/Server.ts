import { Server as RawServer } from 'revolt-api/types/Servers'
import { Client, RoleManager } from '..'
import { ServerChannelManager, ServerMemberManager } from '../managers'
import { User, Base } from '.'

export class Server extends Base {
    name!: string
    id!: string
    description!: string | null
    ownerId!: string
    channels: ServerChannelManager
    members: ServerMemberManager
    roles: RoleManager
    deleted = false
    _channels: string[] = []
    _roles: string[] = []
    constructor(client: Client, data: RawServer) {
        super(client)
        this._patch(data)
        this.channels = new ServerChannelManager(this)
        this.roles = new RoleManager(this)
        this.members = new ServerMemberManager(this)
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
