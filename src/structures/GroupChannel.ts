import { GroupChannel as RawGroupChannel } from 'revolt-api/types/Channels'
import { Client, User, UserResolvable } from '..'
import { ChannelTypes } from '../util/Constants'
import { TextBasedChannel } from './interfaces/TextBasedChannel'

export class GroupChannel extends TextBasedChannel {
    name!: string
    description: string | null = null
    ownerId!: string
    constructor(client: Client, data: RawGroupChannel) {
        super(client, data)
        this.type = ChannelTypes.GROUP
        this._patch(data)
    }

    _patch(data: RawGroupChannel): this {
        if ('description' in data) {
            this.description = data.description ?? null
        }

        if (data.owner) {
            this.ownerId = data.owner
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

    get owner(): User | null {
        return this.client.users.cache.get(this.ownerId) ?? null
    }

    async add(user: UserResolvable): Promise<void> {
        const userId = this.client.users.resolveId(user)
        await this.client.api.put(`/channels/${this.id}/recipients/${userId}`)
    }

    async remove(user: UserResolvable): Promise<void> {
        const userId = this.client.users.resolveId(user)
        await this.client.api.delete(`/channels/${this.id}/recipients/${userId}`)
    }

    async leave(): Promise<void> {
        await super.delete()
    }
}
