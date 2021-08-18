import { Channel as RawChannel } from 'revolt-api/types/Channels'
import { Client } from '..'
import { Channel, NotesChannel } from '../structures'
import { BaseManager } from './BaseManager'
import { TypeError } from '../errors'
import { ChannelTypes } from '../util/Constants'

export type ChannelResolvable = Channel | RawChannel | string

export class ChannelManager extends BaseManager<string, Channel, RawChannel> {
    holds = null

    constructor(public client: Client) {
        super()
    }

    _add(raw: RawChannel): Channel {
        const channel = Channel.create(this.client, raw)

        if (channel.type === ChannelTypes.NOTES && this.client.isReady()) {
            this.client.user.notes = channel as NotesChannel
        }

        this.cache.set(channel.id, channel)

        return channel
    }

    _remove(id: string): void {
        const channel = this.cache.get(id)

        if (channel?.inServer()) {
            channel.server?.channels.cache.delete(id)
        }

        super._remove(id)
    }

    resolve(channel: ChannelResolvable): Channel | null {
        if (channel instanceof Channel) return channel
        return super.resolve(channel)
    }

    resolveId(channel: ChannelResolvable): string | null {
        if (channel instanceof Channel) return channel.id
        return super.resolveId(channel)
    }

    async delete(channel: ChannelResolvable): Promise<void> {
        const channelId = this.resolveId(channel)
        if (!channelId) throw new TypeError('INVALID_TYPE', 'channel', 'ChannelResolvable')
        await this.client.api.delete(`/channels/${channelId}`)
    }

    async ack(channel: ChannelResolvable): Promise<void> {
        const channelId = this.resolveId(channel)
        if (!channelId) throw new TypeError('INVALID_TYPE', 'channel', 'ChannelResolvable')
        await this.client.api.put(`/channels/${channelId}/ack`)
    }

    async fetch(_channel: ChannelResolvable, { force = true } = {}): Promise<Channel> {
        const channelId = this.resolveId(_channel)

        if (!channelId) throw new TypeError('INVALID_TYPE', 'channel', 'ChannelResolvable')

        if (!force) {
            const channel = this.cache.get(channelId)
            if (channel) return channel
        }

        const data = await this.client.api.get(`/channels/${channelId}`)

        return this._add(data)
    }
}
