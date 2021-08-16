import { Channel as RawChannel } from 'revolt-api/types/Channels'
import { ServerChannel, VoiceChannel } from '.'
import { Client } from '..'
import { ChannelTypes } from '../util/Constants'
import { UUID } from '../util/UUID'
import { Base } from './Base'
import { TextBasedChannel } from './interfaces/TextBasedChannel'

export class Channel implements Base {
    id: string
    type: ChannelTypes | 'UNKNOWN'
    deleted = false
    constructor(public client: Client, raw: RawChannel) {
        this.id = raw._id
        this.type = ChannelTypes[raw.channel_type] ?? 'UNKNOWN'
    }

    get createdTimestamp(): number {
        return this.createdAt.getTime()
    }

    get createdAt(): Date {
        return UUID.extrectTime(this.id)
    }

    isText(): this is TextBasedChannel {
        return 'messages' in this
    }

    isVoice(): this is VoiceChannel {
        return this instanceof VoiceChannel
    }

    inServer(): this is ServerChannel {
        return this instanceof ServerChannel
    }

    async ack(): Promise<void> {
        await this.client.api.put(`/channels/${this.id}/ack`)
    }

    async delete(): Promise<void> {
        await this.client.api.delete(`/channels/${this.id}`)
    }

    toString(): string {
        return `<#${this.id}>`
    }
}
