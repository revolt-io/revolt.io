import type { Channel as APIChannel } from 'revolt-api'
import { BaseManager } from './BaseManager'
import { TypeError } from '../errors/index'
import { Channel, NotesChannel } from '../structures/index'
import { ChannelTypes } from '../util/index'

export type ChannelResolvable = Channel | APIChannel | string

export class ChannelManager extends BaseManager<Channel, APIChannel> {
    holds = null

    _add(raw: APIChannel): Channel {
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
        const id = this.resolveId(channel)
        if (!id) throw new TypeError('INVALID_TYPE', 'channel', 'ChannelResolvable')
        await this.client.api.delete(`/channels/${id}`)
    }

    async fetch(channel: ChannelResolvable, { force = true } = {}): Promise<Channel> {
        const id = this.resolveId(channel)

        if (!id) throw new TypeError('INVALID_TYPE', 'channel', 'ChannelResolvable')

        if (!force) {
            const channel = this.cache.get(id)
            if (channel) return channel
        }

        const data = (await this.client.api.get(`/channels/${id}`)) as APIChannel

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
