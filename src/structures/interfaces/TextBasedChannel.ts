import type { MessageManager, Message, MessageOptions } from '../..'

export interface TextBasedChannel {
    messages: MessageManager
    lastMessageId: string | null
    lastMessage: Message | null
    send(options: MessageOptions | string): Promise<Message>
}
