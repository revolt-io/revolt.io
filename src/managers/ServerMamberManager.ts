import { Member as RawMember } from 'revolt-api/types/Servers'
import { Client } from '..'
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
    client: Client

    constructor(public server: Server) {
        super()
        this.client = server.client
    }

    resolveId(member: ServerMemberResolvable): string | null {
        if (member instanceof ServerMember || member instanceof User) return member.id
        if (typeof member === 'string') return member
        if ('_id' in member) return member._id.user
        return null
    }

    async edit(member: ServerMemberResolvable, options: EditServerMemberOptions): Promise<void> {
        const memberId = this.resolveId(member)
        await this.client.api.patch(`/servers/${this.server.id}/members/${memberId}`, {
            body: { ...options }
        })
    }

    fetch(member: ServerMemberResolvable): Promise<ServerMember>
    fetch(): Promise<Collection<string, ServerMember>>
    async fetch(member?: ServerMemberResolvable): Promise<ServerMember | Collection<string, ServerMember>> {
        const memberId = typeof member !== 'undefined' ? this.resolveId(member) : null

        if (memberId) {
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
