import { Message, MessageManager, MessageOptions } from '../..'
import { Channel } from '../Channel'

export abstract class TextBasedChannel extends Channel {
    lastMessageId: string | null = null
    messages = new MessageManager(this)

    send(options: MessageOptions | string): Promise<Message> {
        return this.messages.send(options)
    }

    get lastMessage(): Message | null {
        if (!this.lastMessageId) return null
        return this.messages.cache.get(this.lastMessageId) ?? null
    }
}
