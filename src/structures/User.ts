import { Base } from './Base'
import { Client } from '..'
import { User as RawUser } from 'revolt-api/types/Users'
import { Presence } from '../util/Constants'
import { DMChannel } from './DMChannel'

export class User extends Base {
    username!: string
    id!: string
    avatar: string | null = null
    status = {
        text: null,
        presence: Presence.Invisible
    } as {
        text: string | null
        presence: Presence
    }
    constructor(client: Client, data: RawUser) {
        super(client)
        this._patch(data)
    }

    _patch(data: RawUser): this {
        if (data._id) {
            this.id = data._id
        }

        if (data.username) {
            this.username = data.username
        }

        if ('avatar' in data) {
            this.avatar = data.avatar?._id ?? null
        }

        if ('status' in data) {
            const presence = data.status?.presence ? Presence[data.status?.presence] : Presence.Invisible
            this.status.presence = presence ?? Presence.Invisible
            this.status.text = data.status?.text ?? null
        }

        return this
    }

    _update(data: RawUser): this {
        const clone = this._clone()
        clone._patch(data)
        return clone
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

    fetch(force = true): Promise<User> {
        return this.client.users.fetch(this, { force })
    }

    // async deleteDM(): Promise<void> {
    //     await this.
    // }

    toString(): string {
        return `<@${this.id}>`
    }
}
