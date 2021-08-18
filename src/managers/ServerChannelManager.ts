import { Channel as RawChannel, ServerChannel as RawServerChannel } from 'revolt-api/types/Channels'
import { BaseManager } from '.'
import { Client } from '..'
import { TypeError } from '../errors'
import { Server, ServerChannel, TextChannel, VoiceChannel } from '../structures'
import { UUID } from '../util'

export type ServerChannelResolvable = ServerChannel | RawServerChannel | string

export interface CreateChannelOptions {
    name: string
    type?: 'Text' | 'Voice'
    description?: string
}

export class ServerChannelManager extends BaseManager<string, ServerChannel> {
    client: Client
    holds = ServerChannel
    constructor(public server: Server) {
        super()
        this.client = server.client
        for (const channelId of server._channels) {
            const channel = this.client.channels.cache.get(channelId)
            if (channel?.inServer()) this.cache.set(channel.id, channel)
        }
    }

    _add(raw: RawChannel): ServerChannel {
        let channel: ServerChannel

        switch (raw.channel_type) {
            case 'TextChannel':
                channel = new TextChannel(this.client, raw)
                break
            case 'VoiceChannel':
                channel = new VoiceChannel(this.client, raw)
                break
            default:
                throw new Error(`Unknown channel type: ${raw.channel_type}`)
        }

        this.cache.set(channel.id, channel)

        return channel
    }

    async create({ name, type = 'Text', description }: CreateChannelOptions): Promise<ServerChannel> {
        const data = await this.client.api.post(`/servers/${this.server.id}/channels`, {
            body: {
                name,
                type,
                description,
                nonce: UUID.generate()
            }
        })
        return this._add(data)
    }

    async fetch(channel: ServerChannelResolvable, { force = true } = {}): Promise<ServerChannel> {
        const channelId = this.resolveId(channel)

        if (!channelId) throw new TypeError('INVALID_TYPE', 'channel', 'ServerChannelResolvable')

        if (!force) {
            const channel = this.cache.get(channelId)
            if (channel) return channel
        }

        const data = await this.client.api.get(`/servers/${this.server.id}/channels/${channelId}`)

        return this._add(data)
    }
}
