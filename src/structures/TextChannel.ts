import { TextChannel as RawTextChannel } from 'revolt-api/types/Channels'
import { Message, ServerChannel } from '.'
import { TextBasedChannel } from './interfaces/TextBasedChannel'
import { Client } from '..'
import { MessageManager, MessageOptions } from '../managers'
import { ChannelTypes } from '../util'

export class TextChannel extends ServerChannel implements TextBasedChannel {
    lastMessageId: string | null = null
    messages = new MessageManager(this)
    readonly type = ChannelTypes.TEXT
    constructor(client: Client, raw: RawTextChannel) {
        super(client, raw)
        this.lastMessageId = raw.last_message_id ?? null
    }

    send(options: MessageOptions | string): Promise<Message> {
        return this.messages.send(options)
    }

    get lastMessage(): Message | null {
        if (!this.lastMessageId) return null
        return this.messages.cache.get(this.lastMessageId) ?? null
    }
}
