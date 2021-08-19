import { GroupChannel as RawGroupChannel } from 'revolt-api/types/Channels'
import { TextBasedChannel } from './interfaces/TextBasedChannel'
import { Client, User, UserResolvable } from '..'
import { TypeError } from '../errors'
import { ChannelPermissions, ChannelTypes, Collection } from '../util'

export class GroupChannel extends TextBasedChannel {
    name!: string
    description: string | null = null
    ownerId!: string
    readonly type = ChannelTypes.GROUP
    permissions!: Readonly<ChannelPermissions>
    icon: string | null = null
    _users: string[] = []
    constructor(client: Client, data: RawGroupChannel) {
        super(client, data)
        this._patch(data)
    }

    _patch(data: RawGroupChannel): this {
        if (!data) return this

        if ('description' in data) {
            this.description = data.description ?? null
        }

        if (Array.isArray(data.recipients)) {
            this._users = data.recipients
        }

        if (typeof data.permissions === 'number') {
            this.permissions = new ChannelPermissions(data.permissions).freeze()
        }

        if (data.owner) {
            this.ownerId = data.owner
        }

        if ('icon' in data) {
            this.icon = data.icon?._id ?? null
        }

        if (data.name) {
            this.name = data.name
        }

        return this
    }

    _update(data: RawGroupChannel): this {
        const clone = this._clone()
        this._patch(data)
        return clone
    }

    async add(user: UserResolvable): Promise<void> {
        const userId = this.client.users.resolveId(user)
        if (!userId) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable')
        await this.client.api.put(`/channels/${this.id}/recipients/${userId}`)
    }

    async remove(user: UserResolvable): Promise<void> {
        const userId = this.client.users.resolveId(user)
        if (!userId) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable')
        await this.client.api.delete(`/channels/${this.id}/recipients/${userId}`)
    }

    async leave(): Promise<void> {
        await super.delete()
    }

    iconURL(options?: { size: number }): string | null {
        if (!this.icon) return null
        return this.client.endpoints.icon(this.icon, options?.size)
    }

    get owner(): User | null {
        return this.client.users.cache.get(this.ownerId) ?? null
    }

    get users(): Collection<string, User> {
        const users = new Collection<string, User>()

        for (const userId of this._users) {
            const user = this.client.users.cache.get(userId)
            if (user) users.set(user.id, user)
        }

        return users
    }

    get members(): Collection<string, User> {
        return this.users
    }
}
