import type { API } from '../../deps.ts';
import { Attachment, Category, Channel, Invite, Server } from './mod.ts';
import { Client } from '../client/Client.ts';
import { ChannelPermissions, Collection } from '../util/mod.ts';

type APIServerChannel = Extract<
  API.Channel,
  { channel_type: 'TextChannel' | 'VoiceChannel' }
>;

export interface Overwrite {
  allow: ChannelPermissions;
  deny: ChannelPermissions;
}

export class ServerChannel<T extends APIServerChannel = APIServerChannel>
  extends Channel<T> {
  name!: string;
  serverId!: string;
  description: string | null = null;
  icon: Attachment | null = null;
  overwrites = new Collection<string, Overwrite>();
  nsfw = false;
  constructor(client: Client, data: T) {
    super(client);
    this._patch(data);
  }

  protected _patch(data: T, clear: API.FieldsChannel[] = []): this {
    super._patch(data);

    if (data.name) this.name = data.name;

    if (data.server) this.serverId = data.server;

    if ('description' in data) this.description = data.description ?? null;

    if (data.icon) this.icon = new Attachment(this.client, data.icon);

    if (typeof data.nsfw === 'boolean') this.nsfw = data.nsfw;

    if (data.role_permissions) {
      this.overwrites.clear();
      for (const [id, { a, d }] of Object.entries(data.role_permissions)) {
        this.overwrites.set(id, {
          allow: new ChannelPermissions(a),
          deny: new ChannelPermissions(d),
        });
      }
    }

    for (const field of clear) {
      if (field === 'Icon') this.icon = null;
      if (field === 'Description') this.description = null;
    }

    return this;
  }

  async createInvite(): Promise<Invite> {
    const data = await this.client.api.post(`/channels/${this.id}/invites`);
    return new Invite(this.client, data);
  }

  iconURL(options?: { size: number }): string | null {
    return this.icon
      ? this.client.api.cdn.icon(this.icon.id, options?.size)
      : null;
  }

  get server(): Server {
    return this.client.servers.cache.get(this.serverId)!;
  }

  get category(): Category | null {
    return this.server.categories.find((cat) => cat.children.has(this.id)) ??
      null;
  }
}
