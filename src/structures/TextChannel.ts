import { TextChannel as RawTextChannel } from 'revolt-api/types/Channels'
import { Client, Message, MessageManager, MessageOptions } from '..'
import { ChannelTypes } from '../util/Constants'
import { TextBasedChannel } from './interfaces/TextBasedChannel'
import { ServerChannel } from './ServerChannel'

export class TextChannel extends ServerChannel implements TextBasedChannel {
    lastMessageId: string | null = null
    messages = new MessageManager(this)
    readonly type = ChannelTypes.TEXT
    constructor(client: Client, raw: RawTextChannel) {
        super(client, raw)
        this.lastMessageId = raw.last_message ?? null
    }

    send(options: MessageOptions | string): Promise<Message> {
        return this.messages.send(options)
    }
}
