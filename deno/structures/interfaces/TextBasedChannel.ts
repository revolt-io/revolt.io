import type { MessageManager, Message, MessageOptions } from '../../index.ts'

export interface TextBasedChannel {
    messages: MessageManager
    lastMessageId: string | null
    lastMessage: Message | null
    send(options: MessageOptions | string): Promise<Message>
}
