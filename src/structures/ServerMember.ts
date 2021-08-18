import { Attachment } from 'revolt-api/types/Autumn'
import { Member as RawMember } from 'revolt-api/types/Servers'
import { Client, Server, User } from '..'
import { Base } from './Base'

export class ServerMember extends Base {
    id!: string
    serverId!: string
    nickname: string | null = null
    avatar: Attachment | null = null
    constructor(client: Client, data: RawMember) {
        super(client)
        this._patch(data)
    }

    async setNickname(nickname?: string): Promise<this> {
        await this.server.members.edit(this, { nickname })
        return this
    }

    ban(reason?: string): Promise<void> {
        return this.server.members.ban(this, reason)
    }

    kick(): Promise<void> {
        return this.server.members.kick(this)
    }

    leave(): Promise<void> {
        return this.client.servers.delete(this.serverId)
    }

    displayAvatarURL(): string {
        return ''
    }

    _patch(data: RawMember): this {
        if ('nickname' in data) {
            this.nickname = data.nickname ?? null
        }

        if ('avatar' in data) {
            this.avatar = data.avatar ?? null
        }

        if (data._id) {
            this.serverId = data._id.server
            this.id = data._id.user
        }

        return this
    }

    _update(data: RawMember): this {
        const clone = this._clone()
        clone._patch(data)
        return clone
    }

    get user(): User | null {
        return this.client.users.cache.get(this.id) ?? null
    }

    get server(): Server {
        return this.client.servers.cache.get(this.serverId) as Server
    }

    toString(): string {
        return `<@${this.id}>`
    }
}
