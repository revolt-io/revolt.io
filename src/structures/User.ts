import { Attachment } from 'revolt-api/types/Autumn'
import { User as RawUser } from 'revolt-api/types/Users'
import { Base, DMChannel } from '.'
import { Client } from '..'
import { Badges, Presence, UUID } from '../util'

export class User extends Base {
    username!: string
    id!: string
    avatar: Attachment | null = null
    status = {
        text: null,
        presence: Presence.Invisible
    } as {
        text: string | null
        presence: Presence
    }
    badges!: Badges
    constructor(client: Client, data: RawUser) {
        super(client)
        this._patch(data)
    }

    _patch(data: RawUser): this {
        if (!data) return this

        if (data._id) {
            this.id = data._id
        }

        if (data.username) {
            this.username = data.username
        }

        if (typeof data.badges === 'number') {
            this.badges = new Badges(data.badges).freeze()
        }

        if ('avatar' in data) {
            this.avatar = data.avatar ?? null
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

    get createdAt(): Date {
        return UUID.extrectTime(this.id)
    }

    get createdTimestamp(): number {
        return this.createdAt.getTime()
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

    avatarURL(options?: { size: number }): string | null {
        if (this.avatar) {
            return this.client.endpoints.avatar(this.avatar._id, this.avatar.filename, options?.size)
        }
        return null
    }

    displayAvatarURL(options?: { size: number }): string {
        return this.avatarURL(options) ?? `${this.client.options.http.api}/users/${this.id}/default_avatar`
    }

    fetch(force = true): Promise<User> {
        return this.client.users.fetch(this, { force })
    }

    toString(): string {
        return `<@${this.id}>`
    }
}
