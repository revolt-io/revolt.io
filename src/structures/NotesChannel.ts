import type { API } from '../../deps.ts';
import { Channel, Message, User } from './mod.ts';
import { TextBasedChannel } from './interfaces/mod.ts';
import { Client } from '../client/Client.ts';
import {
  MessageManager,
  MessageOptions,
  MessageResolvable,
} from '../managers/mod.ts';
import { ChannelTypes, Collection } from '../util/mod.ts';

type APINotesChannel = Extract<API.Channel, { channel_type: 'SavedMessages' }>;

export class NotesChannel extends Channel<APINotesChannel>
  implements TextBasedChannel {
  readonly type = ChannelTypes.NOTES;
  userId!: string;
  lastMessageId: string | null = null;
  messages = new MessageManager(this);
  constructor(client: Client, data: APINotesChannel) {
    super(client);
    this._patch(data);
  }

  protected _patch(data: APINotesChannel): this {
    super._patch(data);

    if (data.user) {
      this.userId = data.user;
    }

    return this;
  }

  send(options: MessageOptions | string): Promise<Message> {
    return this.messages.send(options);
  }

  bulkDelete(
    messages: MessageResolvable[] | Collection<string, Message> | number,
  ): Promise<void> {
    return this.messages.bulkDelete(messages);
  }

  get lastMessage(): Message | null {
    if (!this.lastMessageId) return null;
    return this.messages.cache.get(this.lastMessageId) ?? null;
  }

  get user(): User {
    return this.client.user!;
  }
}
