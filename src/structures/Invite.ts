import { Base } from './Base.ts';
import type { API } from '../../deps.ts';
import type { Server, User } from './mod.ts';
import type { Client } from '../client/Client.ts';

export class Invite extends Base {
  serverId: string | null = null;
  inviterId!: string;
  channelId!: string;

  constructor(client: Client, data: API.Invite) {
    super(client);
    this._patch(data);
  }

  protected _patch(data: API.Invite): this {
    super._patch(data);

    if (data.channel) this.channelId = data.channel;
    if (data.creator) this.inviterId = data.channel;

    return this;
  }

  get server(): Server | null {
    return this.client.servers.cache.get(this.serverId!) ?? null;
  }

  get channel() {
    return this.client.channels.cache.get(this.channelId) ?? null;
  }

  get inviter(): User | null {
    return this.client.users.cache.get(this.inviterId) ?? null;
  }

  toString(): string {
    return this.client.api.cdn.invite(this.id);
  }
}
