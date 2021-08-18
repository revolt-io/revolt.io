import { Channel as RawChannel } from 'revolt-api/types/Channels'
import { Base, DMChannel, GroupChannel, NotesChannel, ServerChannel, TextChannel, VoiceChannel } from '.'
import { TextBasedChannel } from './interfaces/TextBasedChannel'
import { Client } from '..'
import { ChannelTypes, UUID } from '../util'

export abstract class Channel extends Base {
    id: string
    type: ChannelTypes | 'UNKNOWN' = 'UNKNOWN'
    deleted = false
    constructor(client: Client, raw: RawChannel) {
        super(client)
        this.id = raw._id
    }

    get createdTimestamp(): number {
        return this.createdAt.getTime()
    }

    get createdAt(): Date {
        return UUID.extrectTime(this.id)
    }

    async ack(): Promise<void> {
        await this.client.channels.ack(this)
    }

    async delete(): Promise<void> {
        await this.client.channels.delete(this)
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

    toString(): string {
        return `<#${this.id}>`
    }

    fetch(force = true): Promise<Channel> {
        return this.client.channels.fetch(this, { force })
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
}
