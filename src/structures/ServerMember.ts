import { Member as RawMember } from 'revolt-api/types/Servers'
import { Client, User, Server } from '..'
import { Base } from './Base'

export class ServerMember extends Base {
    id!: string
    serverId!: string
    nickname: string | null = null

    constructor(client: Client, data: RawMember) {
        super(client)
        this._patch(data)
    }

    _patch(data: RawMember): this {
        if ('nickname' in data) {
            this.nickname = data.nickname ?? null
        }

        if (data._id) {
            this.serverId = data._id.server
            this.id = data._id.user
        }

        return this
    }

    _update(data: RawMember): ServerMember {
        const clone = this._clone()
        clone._patch(data)
        return clone
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
