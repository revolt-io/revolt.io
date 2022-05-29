import type { Channel as APIChannel } from 'https://deno.land/x/revolt_api@0.4.0/types.ts';
import { Message, ServerChannel } from './mod.ts';
import { TextBasedChannel } from './interfaces/mod.ts';
import { Client } from '../client/Client.ts';
import { MessageManager, MessageOptions } from '../managers/mod.ts';
import { ChannelTypes } from '../util/mod.ts';

type APITextChannel = Extract<APIChannel, { channel_type: 'TextChannel' }>;

export class TextChannel extends ServerChannel<APITextChannel>
  implements TextBasedChannel {
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

  send(options: MessageOptions | string): Promise<Message> {
    return this.messages.send(options);
  }

  get lastMessage(): Message | null {
    if (!this.lastMessageId) return null;
    return this.messages.cache.get(this.lastMessageId) ?? null;
  }
}
