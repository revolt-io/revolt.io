import { Channel as APIChannel } from 'revolt-api'
import { BaseManager } from '.'
import { TypeError } from '../errors'
import { Server, ServerChannel, TextChannel, VoiceChannel } from '../structures'
import { UUID } from '../util'

type APIServerChannel = Extract<APIChannel, { channel_type: 'TextChannel' | 'VoiceChannel' }>

export type ServerChannelResolvable = ServerChannel | APIServerChannel | string

export interface CreateChannelOptions {
    name: string
    type?: 'Text' | 'Voice'
    description?: string
}

export class ServerChannelManager extends BaseManager<ServerChannel> {
    client = this.server.client
    holds = ServerChannel
    constructor(public server: Server) {
        super()
    }

    _add(data: APIChannel): ServerChannel {
        let channel: ServerChannel

        switch (data.channel_type) {
            case 'TextChannel':
                channel = new TextChannel(this.client, data)
                break
            case 'VoiceChannel':
                channel = new VoiceChannel(this.client, data)
                break
            default:
                throw new Error(`Unknown channel type: ${data.channel_type}`)
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
        const id = this.resolveId(channel)

        if (!id) throw new TypeError('INVALID_TYPE', 'channel', 'ServerChannelResolvable')

        if (!force) {
            const channel = this.cache.get(id)
            if (channel) return channel
        }

        const data = await this.client.api.get(`/servers/${this.server.id}/channels/${id}`)

        return this._add(data)
    }
}
