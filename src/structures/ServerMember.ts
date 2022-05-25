import { Member as APIMember, File } from 'revolt-api'
import { Base, Server, User } from './index'
import { Client } from '../client/Client'

export class ServerMember extends Base<APIMember> {
    serverId!: string
    nickname: string | null = null
    avatar: File | null = null
    constructor(client: Client, data: APIMember) {
        super(client)
        this._patch(data)
    }

    protected _patch(data: APIMember): this {
        super._patch(data)

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

    displayAvatarURL(options?: { size: number }): string {
        return this.user.displayAvatarURL(options)
    }

    get user(): User {
        return this.client.users.cache.get(this.id)!
    }

    get server(): Server {
        return this.client.servers.cache.get(this.serverId)!
    }

    toString(): string {
        return `<@${this.id}>`
    }
}
