import type { Channel as APIChannel } from 'revolt-api'
import { Base, DMChannel, GroupChannel, NotesChannel, ServerChannel, TextChannel, VoiceChannel } from './index'
import type { Client } from '../client/Client'
import { ChannelTypes, UUID } from '../util/index'

export abstract class Channel<T extends APIChannel = APIChannel> extends Base<T> {
    type: ChannelTypes | 'UNKNOWN' = 'UNKNOWN'

    constructor(client: Client, data: T) {
        super(client)
        this._patch(data)
    }

    static create(client: Client, data: APIChannel): Channel {
        let channel: Channel

        switch (data.channel_type) {
            case 'TextChannel':
                channel = new TextChannel(client, data)
                break
            case 'VoiceChannel':
                channel = new VoiceChannel(client, data)
                break
            case 'DirectMessage':
                channel = new DMChannel(client, data)
                break
            case 'Group':
                channel = new GroupChannel(client, data)
                break
            case 'SavedMessages':
                channel = new NotesChannel(client, data)
                break
        }

        return channel
    }
    get createdTimestamp(): number {
        return this.createdAt.getTime()
    }

    get createdAt(): Date {
        return UUID.timestampOf(this.id)
    }

    async delete(): Promise<void> {
        await this.client.channels.delete(this)
    }

    isText(): this is TextChannel | GroupChannel | DMChannel {
        return 'messages' in this
    }

    isVoice(): this is VoiceChannel {
        return this.type === ChannelTypes.VOICE
    }

    isGroup(): this is GroupChannel {
        return this.type === ChannelTypes.GROUP
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
}
