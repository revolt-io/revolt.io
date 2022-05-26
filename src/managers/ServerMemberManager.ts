import type { Member as APIMember } from 'revolt-api'
import { BaseManager } from './BaseManager'
import { TypeError } from '../errors/index'
import { Server, ServerMember, User } from '../structures/index'
import { Collection } from '../util/index'

export type ServerMemberResolvable = ServerMember | User | APIMember | string

export interface EditServerMemberOptions {
    nickname?: string
    avatar?: string
    roles?: string[]
}

export class ServerMemberManager extends BaseManager<ServerMember, APIMember> {
    holds = ServerMember
    constructor(protected readonly server: Server) {
        super(server.client)
    }

    async edit(member: ServerMemberResolvable, options: EditServerMemberOptions): Promise<void> {
        const id = this.resolveId(member)
        if (!id) throw new TypeError('INVALID_TYPE', 'member', 'ServerMemberResolvable')
        await this.client.api.patch(`/servers/${this.server.id}/members/${id}`, { body: { ...options } })
    }

    async ban(member: ServerMemberResolvable, reason?: string): Promise<void> {
        const id = this.resolveId(member)
        if (!id) throw new TypeError('INVALID_TYPE', 'member', 'ServerMemberResolvable')
        await this.client.api.put(`/servers/${this.server.id}/bans/${id}`, { body: { reason } })
    }

    async kick(member: ServerMemberResolvable): Promise<void> {
        const id = this.resolveId(member)
        if (!id) throw new TypeError('INVALID_TYPE', 'member', 'ServerMemberResolvable')
        await this.client.api.delete(`/servers/${this.server.id}/members/${id}`)
    }

    async unban(member: ServerMemberResolvable): Promise<void> {
        const id = this.resolveId(member)
        if (!id) throw new TypeError('INVALID_TYPE', 'member', 'ServerMemberResolvable')
        await this.client.api.delete(`/servers/${this.server.id}/bans/${id}`)
    }

    async fetch(member: ServerMemberResolvable): Promise<ServerMember>
    async fetch(): Promise<Collection<string, ServerMember>>
    async fetch(member?: ServerMemberResolvable): Promise<ServerMember | Collection<string, ServerMember>> {
        if (typeof member !== 'undefined') {
            const id = this.resolveId(member)
            if (!id) throw new TypeError('INVALID_TYPE', 'member', 'ServerMemberResolvable')
            const data = await this.client.api.get(`/servers/${this.server.id}/members/${id}`)
            return this._add(data)
        }

        const { members } = await this.client.api.get(`/servers/${this.server.id}/members`)

        return members.reduce((coll, cur) => {
            const member = this._add(cur)
            coll.set(member.id, member)
            return coll
        }, new Collection<string, ServerMember>())
    }

    resolveId(member: ServerMemberResolvable): string | null {
        if (member == null) return null
        if (member instanceof ServerMember || member instanceof User) return member.id
        if (typeof member === 'string') return member
        if ('_id' in member) return member._id.user
        return null
    }
}
