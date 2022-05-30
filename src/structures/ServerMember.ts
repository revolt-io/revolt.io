import type { API } from '../../deps.ts';
import { Base } from './Base.ts';
import { Attachment, Server, User } from './mod.ts';
import { Client } from '../client/Client.ts';

export class ServerMember extends Base<API.Member> {
  serverId!: string;
  nickname: string | null = null;
  avatar: Attachment | null = null;
  constructor(client: Client, data: API.Member) {
    super(client);
    this._patch(data);
  }

  protected _patch(data: API.Member, clear: API.FieldsMember[] = []): this {
    super._patch(data);

    if ('nickname' in data) {
      this.nickname = data.nickname ?? null;
    }

    if (data.avatar) {
      this.avatar = new Attachment(this.client, data.avatar);
    }

    if (data._id) {
      this.serverId = data._id.server;
      this.id = data._id.user;
    }

    for (const field of clear) {
      if (field === 'Avatar') this.avatar = null;
      if (field === 'Nickname') this.nickname = null;
    }

    return this;
  }

  async setNickname(nickname?: string): Promise<this> {
    await this.server.members.edit(this, { nickname });
    return this;
  }

  ban(reason?: string): Promise<void> {
    return this.server.members.ban(this, reason);
  }

  kick(): Promise<void> {
    return this.server.members.kick(this);
  }

  leave(): Promise<void> {
    return this.client.servers.delete(this.serverId);
  }

  displayAvatarURL(options?: { size: number }): string {
    return this.user.displayAvatarURL(options);
  }

  get user(): User {
    return this.client.users.cache.get(this.id)!;
  }

  get server(): Server {
    return this.client.servers.cache.get(this.serverId)!;
  }

  toString(): string {
    return `<@${this.id}>`;
  }
}
