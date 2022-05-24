import { User as APIUser, Presence as APIPresence, File } from 'revolt-api'
import { Base, DMChannel } from '.'
import { Client } from '..'
import { Badges, Presence, UUID } from '../util'

export class User extends Base<APIUser> {
    username!: string
    avatar: File | null = null
    status = {
        text: null,
        presence: Presence.INVISIBLE
    } as {
        text: string | null
        presence: Presence
    }
    badges!: Badges
    constructor(client: Client, data: APIUser) {
        super(client)
        this._patch(data)
    }

    protected _patch(data: APIUser): this {
        super._patch(data)

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
            const presence = data.status?.presence ? Presence[data.status.presence.toUpperCase() as Uppercase<APIPresence>] : Presence.INVISIBLE
            this.status.presence = presence
            this.status.text = data.status?.text ?? null
        }

        return this
    }

    get createdAt(): Date {
        return UUID.timestampOf(this.id)
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
        return this.avatar ? this.client.endpoints.avatar(this.avatar._id, this.avatar.filename, options?.size) : null
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
