import type { Server as APIServer } from 'https://deno.land/x/revolt_api@0.4.0/types.ts'
import { BaseManager } from './BaseManager.ts'
import { TypeError } from '../errors/index.ts'
import { Server } from '../structures/index.ts'
import { UUID } from '../util/index.ts'

export type ServerResolvable = Server | APIServer | string

export interface EditServerOptions {
    name?: string
    description?: string
}

export class ServerManager extends BaseManager<Server, APIServer> {
    readonly holds = Server

    _remove(id: string): void {
        const server = this.cache.get(id)

        for (const id of server?.channels.cache.keys() ?? []) {
            this.client.channels._remove(id)
        }

        return super._remove(id)
    }

    async create(name: string): Promise<Server> {
        const { server } = await this.client.api.post('/servers/create', {
            body: {
                name,
                nonce: UUID.generate()
            }
        })
        return this._add(server)
    }

    async edit(server: ServerResolvable, options: EditServerOptions): Promise<void> {
        const id = this.resolveId(server)
        if (!id) throw new TypeError('INVALID_TYPE', 'server', 'ServerResolvable')
        await this.client.api.patch(`/servers/${id}`, { body: options })
    }

    async ack(server: ServerResolvable): Promise<void> {
        const id = this.resolveId(server)
        if (!id) throw new TypeError('INVALID_TYPE', 'server', 'ServerResolvable')
        await this.client.api.put(`/servers/${id}/ack`)
    }

    async delete(server: ServerResolvable): Promise<void> {
        const id = this.resolveId(server)
        if (!id) throw new TypeError('INVALID_TYPE', 'server', 'ServerResolvable')
        await this.client.api.delete(`/servers/${id}`)
    }

    async fetch(server: ServerResolvable, { force = true } = {}): Promise<Server> {
        const id = this.resolveId(server)

        if (!id) throw new TypeError('INVALID_TYPE', 'server', 'ServerResolvable')

        if (!force) {
            const server = this.cache.get(id)
            if (server) return server
        }

        const data = (await this.client.api.get(`/servers/${id}`)) as APIServer

        return this._add(data)
    }
}
