import type { API } from '../../deps.ts';
import type { Client } from '../client/Client.ts';
import type { MessageEditOptions } from '../managers/mod.ts';
import {
  Base,
  DMChannel,
  Embed,
  GroupChannel,
  Mentions,
  Server,
  ServerMember,
  TextChannel,
  User,
} from './mod.ts';
import { UUID } from '../util/mod.ts';

export class Message extends Base {
  type: Uppercase<API.SystemMessage['type']> = 'TEXT';
  content = '';
  channelId!: string;
  authorId!: string;
  embeds: Embed[] = [];
  attachments: API.File[] = [];
  mentions = new Mentions(this, []);
  editedTimestamp: number | null = null;
  constructor(client: Client, data: API.Message) {
    super(client);
    this._patch(data);
  }

  protected _patch(data: API.Message): this {
    super._patch(data);

    if (Array.isArray(data.embeds)) {
      this.embeds = data.embeds;
    }

    if (Array.isArray(data.attachments)) {
      this.attachments = data.attachments;
    }

    if (Array.isArray(data.mentions)) {
      this.mentions = new Mentions(this, data.mentions);
    }

    if (data.author) {
      this.authorId = data.author;
    }

    if (data.channel) {
      this.channelId = data.channel;
    }

    if (typeof data.content === 'string') {
      this.content = data.content;
    }

    if (data.system) {
      this.type = data.system.type.toUpperCase() as Uppercase<
        API.SystemMessage['type']
      >;
    }

    if (data.edited) {
      this.editedTimestamp = Date.parse(data.edited);
    }

    return this;
  }

  get createdAt(): Date {
    return UUID.timestampOf(this.id);
  }

  get createdTimestamp(): number {
    return this.createdAt.getTime();
  }

  get editedAt(): Date | null {
    return this.editedTimestamp ? new Date(this.editedTimestamp) : null;
  }

  get system(): boolean {
    return this.type !== 'TEXT';
  }

  get author(): User | null {
    return this.client.users.cache.get(this.authorId) ?? null;
  }

  get channel(): TextChannel | DMChannel | GroupChannel {
    return this.client.channels.cache.get(this.channelId) as TextChannel;
  }

  get serverId(): string | null {
    const channel = this.channel;
    return channel.inServer() ? channel.serverId : null;
  }

  get server(): Server | null {
    return this.client.servers.cache.get(this.serverId as string) ?? null;
  }

  get member(): ServerMember | null {
    return this.server?.members.cache.get(this.authorId) ?? null;
  }

  get url(): string {
    return `https://app.revolt.chat/${
      this.serverId ? `server/${this.serverId}` : ''
    }/channel/${this.channelId}/${this.id}`;
  }

  ack(): Promise<void> {
    return this.channel.messages.ack(this);
  }

  delete(): Promise<void> {
    return this.channel.messages.delete(this);
  }

  reply(content: string, mention = true): Promise<Message> {
    return this.channel.messages.send({
      content,
      replies: [{ id: this.id, mention }],
    });
  }

  edit(options: MessageEditOptions | string): Promise<void> {
    return this.channel.messages.edit(this, options);
  }

  fetch(): Promise<Message> {
    return this.channel.messages.fetch(this.id);
  }

  inServer(): this is this & {
    serverId: string;
    server: Server;
    channel: TextChannel;
  } {
    return this.channel.inServer();
  }

  toString(): string {
    return this.content;
  }
}
