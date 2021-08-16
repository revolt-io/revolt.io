import { Client } from '../client/Client'
import { Base } from './Base'
import { Role as RawRole } from 'revolt-api/types/Servers'
import { Server } from './Server'

export class Role implements Base {
    name: string
    color: string | null
    id: string
    client: Client
    constructor(public server: Server, raw: RawRole) {
        this.client = server.client
        this.name = raw.name
        this.color = raw.colour ?? null
    }

    async delete(): Promise<void> {
        await this.server.roles.delete(this)
    }

    toString(): string {
        return `<@&${this.id}>`
    }
}
