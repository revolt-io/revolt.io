import type { API } from '../../deps.ts';
import { Attachment, Base, DMChannel, Presence, Status } from './mod.ts';
import { Client } from '../client/Client.ts';
import { Badges, UUID } from '../util/mod.ts';

export class User extends Base<API.User> {
  username!: string;
  avatar: Attachment | null = null;
  presence = new Presence(this.client);
  badges!: Badges;
  bot = false;

  constructor(client: Client, data: API.User) {
    super(client);
    this._patch(data);
  }

  protected _patch(data: API.User, clear: API.FieldsUser[] = []): this {
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

    if (data.avatar) {
      this.avatar = new Attachment(this.client, data.avatar);
    }

    if ('status' in data) {
      const status = data.status?.presence &&
        Status[data.status.presence.toUpperCase() as Uppercase<API.Presence>];
      this.presence.status = status ?? Status.INVISIBLE;
      this.presence.text = data.status?.text ?? null;
    }

    for (const field of clear) {
      if (field === 'Avatar') this.avatar = null;
      if (field === 'StatusText') this.presence.text = null;
      if (field === 'StatusPresence') this.presence.status = Status.INVISIBLE;
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
        this.avatar.id,
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
