import { Channel as RawChannel } from 'revolt-api/types/Channels'
import { Client } from '..'
import { Channel } from '../structures'
import { BaseManager } from './BaseManager'

export type ChannelResolvable = Channel | RawChannel | string

export class ChannelManager extends BaseManager<string, Channel, RawChannel> {
    holds = null

    constructor(public client: Client) {
        super()
    }

    _add(raw: RawChannel): Channel {
        const channel = Channel.create(this.client, raw)

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

    async fetch(_channel: ChannelResolvable, { force = true } = {}): Promise<Channel> {
        const channelId = this.resolveId(_channel)

        if (!force && channelId) {
            const channel = this.cache.get(channelId)
            if (channel) return channel
        }

        const data = await this.client.api.get(`/channels/${channelId}`)

        return this._add(data)
    }
}
