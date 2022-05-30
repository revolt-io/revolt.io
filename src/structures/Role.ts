import type { API } from '../../deps.ts';
import { Base, Overwrite, Server } from './mod.ts';
import { ChannelPermissions, UUID } from '../util/mod.ts';

export class Role extends Base {
  name!: string;
  color: string | null = null;
  hoist = false;
  rank!: number;
  overwrite!: Overwrite;
  constructor(public server: Server, data: API.Role & { id: string }) {
    super(server.client);
    this._patch(data);
  }

  protected _patch(data: API.Role & { _id?: string }): this {
    super._patch(data);

    if (data.name) this.name = data.name;
    if (typeof data.hoist === 'boolean') this.hoist = data.hoist;
    if (typeof data.rank === 'number') this.rank = data.rank;
    if ('colour' in data) this.color = data.colour ?? null;
    if (data.permissions) {
      const { a, d } = data.permissions;
      this.overwrite = {
        allow: new ChannelPermissions(a),
        deny: new ChannelPermissions(d),
      };
    }

    return this;
  }

  get createdAt(): Date {
    return UUID.timestampOf(this.id);
  }

  get createdTimestamp(): number {
    return this.createdAt.getTime();
  }

  get permissions(): Overwrite {
    return this.overwrite;
  }

  async delete(): Promise<void> {
    await this.server.roles.delete(this);
  }

  toString(): string {
    return `<@&${this.id}>`;
  }
}
