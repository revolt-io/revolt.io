import { Base } from './Base'
import { Client } from '..'
import { User as RawUser } from 'revolt-api/types/Users'
import { Presence } from '../util/Constants'
import { DMChannel } from './DMChannel'

export class User implements Base {
    username: string
    id: string
    avatar: string | null
    status = {
        text: null,
        presence: Presence.Invisible
    } as {
        text: string | null
        presence: Presence
    }
    constructor(public client: Client, raw: RawUser) {
        this.username = raw.username
        this.id = raw._id
        this.avatar = raw.avatar?._id ?? null
        const presence = raw.status?.presence ? Presence[raw.status?.presence] : Presence.Invisible
        this.status.presence = presence ?? Presence.Invisible
        this.status.text = raw.status?.text ?? null
    }

    async block(): Promise<void> {
        await this.client.api.put(`/users/${this.id}/block`)
    }

    async unblock(): Promise<void> {
        await this.client.api.delete(`/users/${this.id}/block`)
    }

    async createDM(): Promise<DMChannel> {
        const data = await this.client.api.get(`/users/${this.id}/dm`)
        return this.client.channels._add(data) as DMChannel
    }

    toString(): string {
        return `<@${this.id}>`
    }
}
