import { Role as RawRole } from 'revolt-api/types/Servers'
import { TypeError } from '../errors'
import { Role, Server } from '../structures'
import { BaseManager } from './BaseManager'

export type RoleResolvable = Role | string

export class RoleManager extends BaseManager<string, Role, RawRole & { id: string }> {
    holds = Role
    client = this.server.client
    constructor(public server: Server) {
        super()
        for (const [id, role] of Object.entries(server._roles)) {
            this._add(Object.assign(role, { id }))
        }
    }

    _add(data: RawRole & { id: string }): Role {
        const role = new Role(this.server, data)
        this.cache.set(role.id, role)
        return role
    }

    async create(name: string): Promise<Role> {
        const data = await this.client.api.post(`/servers/${this.server.id}/roles`, {
            body: { name }
        })
        return this._add(Object.assign(data, { name, id: data.id }))
    }

    async delete(role: RoleResolvable): Promise<void> {
        const roleId = this.resolveId(role)
        if (!roleId) throw new TypeError('INVALID_TYPE', 'role', 'RoleResolvable')
        await this.client.api.post(`/servers/${this.server.id}/roles/${roleId}`)
    }
}
