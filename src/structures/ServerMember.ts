import { Member as RawMember } from 'revolt-api/types/Servers'
import { Client, User, Server } from '..'
import { Base } from './Base'

export class ServerMember implements Base {
    id: string
    serverId: string
    nickname: string | null

    constructor(public client: Client, raw: RawMember) {
        this.id = raw._id.user
        this.serverId = raw._id.server
        this.nickname = raw.nickname ?? null
    }

    get user(): User | null {
        return this.client.users.cache.get(this.id) ?? null
    }

    get server(): Server | null {
        return this.client.servers.cache.get(this.serverId) ?? null
    }

    toString(): string {
        return `<@${this.id}>`
    }
}
