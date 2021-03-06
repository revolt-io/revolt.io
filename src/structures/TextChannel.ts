import type { API } from '../../deps.ts';
import { Message, ServerChannel } from './mod.ts';
import { TextBasedChannel } from './interfaces/mod.ts';
import { Client } from '../client/Client.ts';
import {
  MessageManager,
  MessageOptions,
  MessageResolvable,
} from '../managers/mod.ts';
import { ChannelTypes, Collection } from '../util/mod.ts';

type APITextChannel = Extract<API.Channel, { channel_type: 'TextChannel' }>;

export class TextChannel extends ServerChannel implements TextBasedChannel {
  lastMessageId: string | null = null;
  messages = new MessageManager(this);
  readonly type = ChannelTypes.TEXT;
  constructor(client: Client, data: APITextChannel) {
    super(client, data);
    this._patch(data);
  }

  protected _patch(data: APITextChannel): this {
    super._patch(data);

    if (data.last_message_id) this.lastMessageId = data.last_message_id;

    return this;
  }

  get lastMessage(): Message | null {
    if (!this.lastMessageId) return null;
    return this.messages.cache.get(this.lastMessageId) ?? null;
  }

  send(options: MessageOptions | string): Promise<Message> {
    return this.messages.send(options);
  }

  bulkDelete(
    messages: MessageResolvable[] | Collection<string, Message> | number,
  ): Promise<void> {
    return this.messages.bulkDelete(messages);
  }
}
