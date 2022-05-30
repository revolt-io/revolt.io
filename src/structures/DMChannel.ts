import type { Channel as APIChannel } from 'revolt-api-types';
import { Channel, Message } from './mod.ts';
import { TextBasedChannel } from './interfaces/mod.ts';
import {
  Client,
  MessageManager,
  MessageOptions,
  MessageResolvable,
} from '../lib.ts';
import {
  ChannelTypes,
  Collection,
  DEFAULT_PERMISSION_DM,
} from '../util/mod.ts';

type APIDirectChannel = Extract<APIChannel, { channel_type: 'DirectMessage' }>;

export class DMChannel extends Channel<APIDirectChannel>
  implements TextBasedChannel {
  readonly type = ChannelTypes.DM;
  active!: boolean;
  permissions = DEFAULT_PERMISSION_DM;
  messages = new MessageManager(this);
  lastMessageId: string | null = null;

  constructor(client: Client, data: APIDirectChannel) {
    super(client);
    this._patch(data);
  }

  protected _patch(data: APIDirectChannel): this {
    super._patch(data);

    if (typeof data.active === 'boolean') this.active = data.active;
    if (data.last_message_id) this.lastMessageId = data.last_message_id;

    return this;
  }

  bulkDelete(
    messages: MessageResolvable[] | Collection<string, Message> | number,
  ): Promise<void> {
    return this.messages.bulkDelete(messages);
  }

  send(options: MessageOptions | string): Promise<Message> {
    return this.messages.send(options);
  }

  get lastMessage(): Message | null {
    if (!this.lastMessageId) return null;
    return this.messages.cache.get(this.lastMessageId) ?? null;
  }
}
