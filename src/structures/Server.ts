import { Server as RawServer } from 'revolt-api/types/Servers'
import { Client, RoleManager } from '..'
import { ServerChannelManager, ServerMemberManager } from '../managers'
import { User, Base } from '.'

export class Server implements Base {
    name: string
    id: string
    description: string | null
    ownerId: string
    _channels: string[] = []
    _roles: string[] = []
    channels: ServerChannelManager
    members: ServerMemberManager
    roles: RoleManager
    deleted = false
    constructor(public client: Client, raw: RawServer) {
        this.id = raw._id
        this.ownerId = raw.owner
        this.name = raw.name
        this.description = raw.description ?? null

        if (Array.isArray(raw.channels)) this._channels = raw.channels

        this.channels = new ServerChannelManager(this)
        this.roles = new RoleManager(this)
        this.members = new ServerMemberManager(this)
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
