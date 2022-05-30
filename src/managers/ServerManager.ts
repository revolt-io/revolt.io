import type { API } from '../../deps.ts';
import { BaseManager } from './BaseManager.ts';
import { TypeError } from '../errors/mod.ts';
import { Server } from '../structures/mod.ts';
import { UUID } from '../util/mod.ts';

export type ServerResolvable = Server | API.Server | string;

export interface EditServerOptions {
  name?: string;
  description?: string;
}

export class ServerManager extends BaseManager<Server, API.Server> {
  readonly holds = Server;

  _remove(id: string): void {
    const server = this.cache.get(id);

    for (const id of server?.channels.cache.keys() ?? []) {
      this.client.channels._remove(id);
    }

    return super._remove(id);
  }

  async create(name: string): Promise<Server> {
    const { server } = await this.client.api.post('/servers/create', {
      body: {
        name,
        nonce: UUID.generate(),
      },
    });
    return this._add(server);
  }

  async edit(
    server: ServerResolvable,
    options: EditServerOptions,
  ): Promise<void> {
    const id = this.resolveId(server);
    if (!id) throw new TypeError('INVALID_TYPE', 'server', 'ServerResolvable');
    await this.client.api.patch(`/servers/${id}`, { body: options });
  }

  async ack(server: ServerResolvable): Promise<void> {
    const id = this.resolveId(server);
    if (!id) throw new TypeError('INVALID_TYPE', 'server', 'ServerResolvable');
    await this.client.api.put(`/servers/${id}/ack`);
  }

  async delete(server: ServerResolvable): Promise<void> {
    const id = this.resolveId(server);
    if (!id) throw new TypeError('INVALID_TYPE', 'server', 'ServerResolvable');
    await this.client.api.delete(`/servers/${id}`);
  }

  async fetch(
    server: ServerResolvable,
    { force = true } = {},
  ): Promise<Server> {
    const id = this.resolveId(server);

    if (!id) throw new TypeError('INVALID_TYPE', 'server', 'ServerResolvable');

    if (!force) {
      const server = this.cache.get(id);
      if (server) return server;
    }

    const data = await this.client.api.get(`/servers/${id}`);

    return this._add(data);
  }
}
