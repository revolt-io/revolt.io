import type { Channel as APIChannel } from 'revolt-api'
import { User, Channel, Message } from './index'
import { TextBasedChannel } from './interfaces/index'
import { Client } from '../client/Client'
import { MessageManager, MessageOptions } from '../managers/index'
import { ChannelTypes } from '../util/index'

type APINotesChannel = Extract<APIChannel, { channel_type: 'SavedMessages' }>

export class NotesChannel extends Channel<APINotesChannel> implements TextBasedChannel {
    readonly type = ChannelTypes.NOTES
    userId!: string
    lastMessageId: string | null = null
    messages = new MessageManager(this)
    constructor(client: Client, data: APINotesChannel) {
        super(client, data)
        this._patch(data)
    }

    protected _patch(data: APINotesChannel): this {
        super._patch(data)

        if (data.user) {
            this.userId = data.user
        }

        return this
    }

    send(options: MessageOptions | string): Promise<Message> {
        return this.messages.send(options)
    }

    get lastMessage(): Message | null {
        if (!this.lastMessageId) return null
        return this.messages.cache.get(this.lastMessageId) ?? null
    }

    get user(): User {
        return this.client.user!
    }
}
