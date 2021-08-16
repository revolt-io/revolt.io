import { GroupChannel as RawGroupChannel } from 'revolt-api/types/Channels'
import { Client, User, UserResolvable } from '..'
import { ChannelTypes } from '../util/Constants'
import { TextBasedChannel } from './interfaces/TextBasedChannel'

export class GroupChannel extends TextBasedChannel {
    name: string
    description: string | null
    ownerId: string

    constructor(client: Client, raw: RawGroupChannel) {
        super(client, raw)
        this.type = ChannelTypes.GROUP
        this.name = raw.name
        this.description = raw.description ?? null
        this.ownerId = raw.owner
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
