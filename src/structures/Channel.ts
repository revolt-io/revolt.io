import { Channel as RawChannel } from 'revolt-api/types/Channels'
import { Base, DMChannel, GroupChannel, NotesChannel, ServerChannel, TextChannel, VoiceChannel } from '.'
import { Client } from '..'
import { ChannelTypes } from '../util/Constants'
import { UUID } from '../util/UUID'
import { TextBasedChannel } from './interfaces/TextBasedChannel'

export abstract class Channel extends Base {
    id: string
    type: ChannelTypes | 'UNKNOWN'
    deleted = false
    constructor(client: Client, raw: RawChannel) {
        super(client)
        this.id = raw._id
        this.type = ChannelTypes[raw.channel_type as keyof typeof ChannelTypes] ?? 'UNKNOWN'
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
        return this.type === ChannelTypes.VOICE
    }

    inServer(): this is ServerChannel {
        return 'serverId' in this
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

    static create(client: Client, raw: RawChannel): Channel {
        let channel: Channel

        switch (raw.channel_type) {
            case 'TextChannel':
                channel = new TextChannel(client, raw)
                break
            case 'VoiceChannel':
                channel = new VoiceChannel(client, raw)
                break
            case 'DirectMessage':
                channel = new DMChannel(client, raw)
                break
            case 'Group':
                channel = new GroupChannel(client, raw)
                break
            case 'SavedMessages':
                channel = new NotesChannel(client, raw)
                break
        }

        return channel
    }

    fetch(force = true): Promise<Channel> {
        return this.client.channels.fetch(this, { force })
    }
}
