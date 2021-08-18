import { Member as RawMember } from 'revolt-api/types/Servers'
import { TypeError } from '../errors'
import { Server, ServerMember, User } from '../structures'
import { Collection } from '../util/Collection'
import { BaseManager } from './BaseManager'

export type ServerMemberResolvable = ServerMember | User | RawMember | string

export interface EditServerMemberOptions {
    nickname?: string
    avatar?: string
    roles?: string[]
}

export class ServerMemberManager extends BaseManager<string, ServerMember, RawMember> {
    holds = ServerMember
    client = this.server.client
    constructor(public server: Server) {
        super()
    }

    resolveId(member: ServerMemberResolvable): string | null {
        if (member instanceof ServerMember || member instanceof User) return member.id
        if (typeof member === 'string') return member
        if ('_id' in member) return member._id.user
        return null
    }

    async edit(member: ServerMemberResolvable, options: EditServerMemberOptions): Promise<void> {
        const memberId = this.resolveId(member)
        if (!memberId) throw new TypeError('INVALID_TYPE', 'member', 'ServerMemberResolvable')
        await this.client.api.patch(`/servers/${this.server.id}/members/${memberId}`, {
            body: { ...options }
        })
    }

    async ban(member: ServerMemberResolvable, reason?: string): Promise<void> {
        const memberId = this.resolveId(member)
        if (!memberId) throw new TypeError('INVALID_TYPE', 'member', 'ServerMemberResolvable')
        await this.client.api.put(`/servers/${this.server.id}/bans/${memberId}`, {
            body: { reason }
        })
    }

    async kick(member: ServerMemberResolvable): Promise<void> {
        const memberId = this.resolveId(member)
        if (!memberId) throw new TypeError('INVALID_TYPE', 'member', 'ServerMemberResolvable')
        await this.client.api.delete(`/servers/${this.server.id}/members/${memberId}`)
    }

    async unban(member: ServerMemberResolvable): Promise<void> {
        const memberId = this.resolveId(member)
        if (!memberId) throw new TypeError('INVALID_TYPE', 'member', 'ServerMemberResolvable')
        await this.client.api.delete(`/servers/${this.server.id}/bans/${memberId}`)
    }

    fetch(member: ServerMemberResolvable): Promise<ServerMember>
    fetch(): Promise<Collection<string, ServerMember>>
    async fetch(member?: ServerMemberResolvable): Promise<ServerMember | Collection<string, ServerMember>> {
        if (typeof member !== 'undefined') {
            const memberId = this.resolveId(member)
            if (!memberId) throw new TypeError('INVALID_TYPE', 'member', 'ServerMemberResolvable')
            const data = await this.client.api.get(`/servers/${this.server.id}/members/${memberId}`)
            return this._add(data)
        }

        const { members } = await this.client.api.get(`/servers/${this.server.id}/members`)

        return (members as RawMember[]).reduce((coll, cur) => {
            const member = this._add(cur)
            coll.set(member.id, member)
            return coll
        }, new Collection<string, ServerMember>())
    }
}
