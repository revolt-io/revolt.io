import type { API } from '../../deps.ts';
import { BaseManager } from './BaseManager.ts';
import { TypeError } from '../errors/mod.ts';
import { Role, Server } from '../structures/mod.ts';

export type RoleResolvable = Role | string;

export class RoleManager extends BaseManager<Role, API.Role & { id: string }> {
  holds = Role;
  constructor(protected readonly server: Server) {
    super(server.client);
  }

  _add(data: API.Role & { id: string }): Role {
    const role = new Role(this.server, data);
    this.cache.set(role.id, role);
    return role;
  }

  async create(name: string): Promise<Role> {
    const { id, role } = await this.client.api.post(
      `/servers/${this.server.id}/roles`,
      { body: { name } },
    );
    return this._add(Object.assign(role, { id }));
  }

  async delete(role: RoleResolvable): Promise<void> {
    const id = this.resolveId(role);
    if (!id) throw new TypeError('INVALID_TYPE', 'role', 'RoleResolvable');
    await this.client.api.delete(`/servers/${this.server.id}/roles/${id}`);
  }
}
