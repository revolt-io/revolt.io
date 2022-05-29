import type { Message, MessageManager, MessageOptions } from '../../lib.ts';

export interface TextBasedChannel {
  messages: MessageManager;
  lastMessageId: string | null;
  lastMessage: Message | null;
  send(options: MessageOptions | string): Promise<Message>;
}
