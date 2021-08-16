import { Client } from '../client/Client'
import { Server } from '../structures'
import { BaseManager } from './BaseManager'
import { Server as RawServer } from 'revolt-api/types/Servers'
import { UUID } from '../util/UUID'

export type ServerResolvable = Server | RawServer | string

export interface EditServerOptions {
    name?: string
    description?: string
}

export class ServerManager extends BaseManager<string, Server, RawServer> {
    readonly holds = Server

    constructor(public client: Client) {
        super()
    }

    async create(name: string): Promise<Server> {
        const data = await this.client.api.post('/servers/create', {
            body: {
                name,
                nonce: UUID.generate()
            }
        })

        return this._add(data)
    }

    async edit(server: ServerResolvable, options: EditServerOptions): Promise<void> {
        const serverId = super.resolveId(server)
        await this.client.api.patch(`/servers/${serverId}`, {
            body: options
        })
    }

    async ack(server: ServerResolvable): Promise<void> {
        const serverId = super.resolveId(server)
        await this.client.api.put(`/servers/${serverId}/ack`)
    }

    async delete(server: ServerResolvable): Promise<void> {
        const serverId = super.resolveId(server)
        await this.client.api.delete(`/servers/${serverId}`)
    }

    async fetch(_server: ServerResolvable, { force = true } = {}): Promise<Server> {
        const serverId = this.resolveId(_server)

        if (!force && serverId) {
            const server = this.cache.get(serverId)
            if (server) return server
        }

        const data = await this.client.api.get(`/servers/${serverId}`)

        return this._add(data)
    }
}
