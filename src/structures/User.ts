import type { API } from '../../deps.ts';
import { Base, DMChannel } from './mod.ts';
import { Client } from '../client/Client.ts';
import { Badges, Presence, UUID } from '../util/mod.ts';

export class User extends Base<API.User> {
  username!: string;
  avatar: API.File | null = null;
  status = {
    text: null,
    presence: Presence.INVISIBLE,
  } as {
    text: string | null;
    presence: Presence;
  };
  badges!: Badges;
  bot = false;

  constructor(client: Client, data: API.User) {
    super(client);
    this._patch(data);
  }

  protected _patch(data: API.User): this {
    super._patch(data);

    if (data.username) {
      this.username = data.username;
    }

    if (data.bot) {
      this.bot = true;
    }

    if (typeof data.badges === 'number') {
      this.badges = new Badges(data.badges).freeze();
    }

    if ('avatar' in data) {
      this.avatar = data.avatar ?? null;
    }

    if ('status' in data) {
      const presence = data.status?.presence
        ? Presence[
          data.status.presence.toUpperCase() as Uppercase<API.Presence>
        ]
        : Presence.INVISIBLE;
      this.status.presence = presence;
      this.status.text = data.status?.text ?? null;
    }

    return this;
  }

  get createdAt(): Date {
    return UUID.timestampOf(this.id);
  }

  get createdTimestamp(): number {
    return this.createdAt.getTime();
  }

  async block(): Promise<void> {
    await this.client.api.put(`/users/${this.id}/block`);
  }

  async unblock(): Promise<void> {
    await this.client.api.delete(`/users/${this.id}/block`);
  }

  async createDM(): Promise<DMChannel> {
    const data = await this.client.api.get(`/users/${this.id}/dm`);
    return this.client.channels._add(data) as DMChannel;
  }

  avatarURL(options?: { size: number }): string | null {
    return this.avatar
      ? this.client.api.cdn.avatar(
        this.avatar._id,
        this.avatar.filename,
        options?.size,
      )
      : null;
  }

  displayAvatarURL(options?: { size: number }): string {
    return this.avatarURL(options) ??
      this.client.api.cdn.defaultAvatar(this.id);
  }

  fetch(force = true): Promise<User> {
    return this.client.users.fetch(this, { force });
  }

  toString(): string {
    return `<@${this.id}>`;
  }
}
