import { Role as RawRole } from 'revolt-api/types/Servers'
import { Client } from '../client/Client'
import { Role, Server } from '../structures'
import { BaseManager } from './BaseManager'

export type RoleResolvable = Role | string

export class RoleManager extends BaseManager<string, Role, RawRole & { _id: string }> {
    holds = Role
    client: Client
    constructor(public server: Server) {
        super()
        this.client = server.client
    }

    async create(name: string): Promise<Role> {
        const data = await this.client.api.post(`/servers/${this.server.id}/roles`, {
            body: { name }
        })
        return this._add(Object.assign(data, { name, _id: data.id }))
    }

    async delete(role: RoleResolvable): Promise<void> {
        const roleId = this.resolveId(role)
        await this.client.api.post(`/servers/${this.server.id}/roles/${roleId}`)
    }
}
