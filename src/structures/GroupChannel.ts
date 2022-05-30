import type { Channel as APIChannel } from 'revolt-api-types';
import type { Message, User } from './mod.ts';
import type { TextBasedChannel } from './interfaces/mod.ts';
import type { Client } from '../client/Client.ts';
import { TypeError } from '../errors/mod.ts';
import { Channel } from './Channel.ts';
import {
  MessageManager,
  MessageOptions,
  MessageResolvable,
  UserResolvable,
} from '../managers/mod.ts';
import { ChannelPermissions, ChannelTypes, Collection } from '../util/mod.ts';

type APIGroupChannel = Extract<APIChannel, { channel_type: 'Group' }>;

export class GroupChannel extends Channel<APIGroupChannel>
  implements TextBasedChannel {
  name!: string;
  description: string | null = null;
  ownerId!: string;
  readonly type = ChannelTypes.GROUP;
  permissions!: Readonly<ChannelPermissions>;
  icon: string | null = null;
  messages = new MessageManager(this);
  lastMessageId: string | null = null;
  users = new Collection<string, User>();
  nsfw = false;

  constructor(client: Client, data: APIGroupChannel) {
    super(client);
    this._patch(data);
  }

  protected _patch(data: APIGroupChannel): this {
    super._patch(data);

    if ('description' in data) {
      this.description = data.description ?? null;
    }

    if (Array.isArray(data.recipients)) {
      this.users.clear();
      for (const userId of data.recipients) {
        const user = this.client.users.cache.get(userId);
        if (user) this.users.set(user.id, user);
      }
    }

    if (typeof data.permissions === 'number') {
      this.permissions = new ChannelPermissions(data.permissions).freeze();
    }

    if (data.owner) {
      this.ownerId = data.owner;
    }

    if ('icon' in data) {
      this.icon = data.icon?._id ?? null;
    }

    if (data.name) {
      this.name = data.name;
    }

    if (data.last_message_id) this.lastMessageId = data.last_message_id;

    if (typeof data.nsfw === 'boolean') this.nsfw = data.nsfw;

    return this;
  }

  get lastMessage(): Message | null {
    if (!this.lastMessageId) return null;
    return this.messages.cache.get(this.lastMessageId) ?? null;
  }

  bulkDelete(
    messages: MessageResolvable[] | Collection<string, Message> | number,
  ): Promise<void> {
    return this.messages.bulkDelete(messages);
  }

  async add(user: UserResolvable): Promise<void> {
    const id = this.client.users.resolveId(user);
    if (!id) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable');
    await this.client.api.put(`/channels/${this.id}/recipients/${id}`);
  }
  async remove(user: UserResolvable): Promise<void> {
    const id = this.client.users.resolveId(user);
    if (!id) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable');
    await this.client.api.delete(`/channels/${this.id}/recipients/${id}`);
  }
  async leave(): Promise<void> {
    await super.delete();
  }
  send(options: MessageOptions | string): Promise<Message> {
    return this.messages.send(options);
  }

  iconURL(options?: { size: number }): string | null {
    if (!this.icon) return null;
    return this.client.api.cdn.icon(this.icon, options?.size);
  }

  get owner(): User | null {
    return this.client.users.cache.get(this.ownerId) ?? null;
  }
}
