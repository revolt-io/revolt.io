import { Channel as RawChannel } from 'revolt-api/types/Channels'
import { Client } from '..'
import { Channel, DMChannel, GroupChannel, TextChannel, VoiceChannel } from '../structures'
import { BaseManager } from './BaseManager'

export type ChannelResolvable = Channel | RawChannel | string

export class ChannelManager extends BaseManager<string, Channel, RawChannel> {
    holds = Channel

    constructor(public client: Client) {
        super()
    }

    _add(raw: RawChannel): Channel {
        let channel: Channel

        switch (raw.channel_type) {
            case 'TextChannel':
                channel = new TextChannel(this.client, raw)
                break
            case 'VoiceChannel':
                channel = new VoiceChannel(this.client, raw)
                break
            case 'DirectMessage':
                channel = new DMChannel(this.client, raw)
                break
            case 'Group':
                channel = new GroupChannel(this.client, raw)
                break
            case 'SavedMessages':
                channel = new Channel(this.client, raw)
                break
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
}
