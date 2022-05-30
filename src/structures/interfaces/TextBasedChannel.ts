import type {
  Collection,
  Message,
  MessageManager,
  MessageOptions,
  MessageResolvable,
} from '../../lib.ts';

export interface TextBasedChannel {
  messages: MessageManager;
  lastMessageId: string | null;
  lastMessage: Message | null;
  send(options: MessageOptions | string): Promise<Message>;
  bulkDelete(
    messages: MessageResolvable[] | Collection<string, Message> | number,
  ): Promise<void>;
}
