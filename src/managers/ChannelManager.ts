import { Channel as RawChannel } from 'revolt-api/types/Channels'
import { BaseManager } from '.'
import { Client } from '..'
import { TypeError } from '../errors'
import { Channel, NotesChannel } from '../structures'
import { ChannelTypes } from '../util'

export type ChannelResolvable = Channel | RawChannel | string

export class ChannelManager extends BaseManager<string, Channel, RawChannel> {
    holds = null

    constructor(public client: Client) {
        super()
    }

    _add(raw: RawChannel): Channel {
        const channel = Channel.create(this.client, raw)

        if (channel.type === ChannelTypes.NOTES && this.client.user) {
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

    async fetch(channel: ChannelResolvable, { force = true } = {}): Promise<Channel> {
        const channelId = this.resolveId(channel)

        if (!channelId) throw new TypeError('INVALID_TYPE', 'channel', 'ChannelResolvable')

        if (!force) {
            const channel = this.cache.get(channelId)
            if (channel) return channel
        }

        const data = await this.client.api.get(`/channels/${channelId}`)

        return this._add(data)
    }

    resolve(channel: ChannelResolvable): Channel | null {
        if (channel instanceof Channel) return channel
        return super.resolve(channel)
    }

    resolveId(channel: ChannelResolvable): string | null {
        if (channel instanceof Channel) return channel.id
        return super.resolveId(channel)
    }
}
