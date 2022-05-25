import { Channel as APIChannel } from 'revolt-api'
import { TextBasedChannel } from './interfaces/index'
import { User, Channel, Message } from './index'
import { TypeError } from '../errors/index'
import { MessageManager, MessageOptions, UserResolvable } from '../managers/index'
import { ChannelPermissions, ChannelTypes, Collection } from '../util/index'
import type { Client } from '../client/Client'

type APIGroupChannel = Extract<APIChannel, { channel_type: 'Group' }>

export class GroupChannel extends Channel<APIGroupChannel> implements TextBasedChannel {
    name!: string
    description: string | null = null
    ownerId!: string
    readonly type = ChannelTypes.GROUP
    permissions!: Readonly<ChannelPermissions>
    icon: string | null = null
    messages = new MessageManager(this)
    lastMessageId: string | null = null
    users = new Collection<string, User>()

    constructor(client: Client, data: APIGroupChannel) {
        super(client, data)
        this._patch(data)
    }

    protected _patch(data: APIGroupChannel): this {
        super._patch(data)

        if ('description' in data) {
            this.description = data.description ?? null
        }

        if (Array.isArray(data.recipients)) {
            this.users.clear()
            for (const userId of data.recipients) {
                const user = this.client.users.cache.get(userId)
                if (user) this.users.set(user.id, user)
            }
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

    get lastMessage(): Message | null {
        if (!this.lastMessageId) return null
        return this.messages.cache.get(this.lastMessageId) ?? null
    }

    async add(user: UserResolvable): Promise<void> {
        const id = this.client.users.resolveId(user)
        if (!id) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable')
        await this.client.api.put(`/channels/${this.id}/recipients/${id}`)
    }
    async remove(user: UserResolvable): Promise<void> {
        const id = this.client.users.resolveId(user)
        if (!id) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable')
        await this.client.api.delete(`/channels/${this.id}/recipients/${id}`)
    }
    async leave(): Promise<void> {
        await super.delete()
    }
    send(options: MessageOptions | string): Promise<Message> {
        return this.messages.send(options)
    }

    iconURL(options?: { size: number }): string | null {
        if (!this.icon) return null
        return this.client.endpoints.icon(this.icon, options?.size)
    }

    get owner(): User | null {
        return this.client.users.cache.get(this.ownerId) ?? null
    }
}
