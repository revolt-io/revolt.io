import type { API } from '../../deps.ts';
import { Channel, Message, User, Attachment, Invite } from './mod.ts';
import type { TextBasedChannel } from './interfaces/mod.ts';
import type { Client } from '../client/Client.ts';
import { TypeError } from '../errors/mod.ts';
import {
  MessageManager,
  MessageOptions,
  MessageResolvable,
  UserResolvable,
} from '../managers/mod.ts';
import { ChannelPermissions, ChannelTypes, Collection } from '../util/mod.ts';

type APIGroupChannel = Extract<API.Channel, { channel_type: 'Group' }>;

export class GroupChannel extends Channel<APIGroupChannel> implements TextBasedChannel {
  readonly type = ChannelTypes.GROUP;
  name!: string;
  description: string | null = null;
  ownerId!: string;
  permissions!: Readonly<ChannelPermissions>;
  icon: Attachment | null = null;
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

    if (data.icon) {
      this.icon = new Attachment(this.client, data.icon)
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


  async createInvite(): Promise<Invite> {
    const data = await this.client.api.post(`/channels/${this.id}/invites`);
    return new Invite(this.client, data)
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
    return this.client.api.cdn.icon(this.icon.id, options?.size);
  }

  get owner(): User | null {
    return this.client.users.cache.get(this.ownerId) ?? null;
  }
}
