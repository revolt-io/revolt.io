import { Role as APIRole } from 'revolt-api'
import { BaseManager } from '.'
import { TypeError } from '../errors'
import { Role, Server } from '../structures'

export type RoleResolvable = Role | string

export class RoleManager extends BaseManager<Role, APIRole & { id: string }> {
    holds = Role
    client = this.server.client
    constructor(public server: Server) {
        super()
    }

    _add(data: APIRole & { id: string }): Role {
        const role = new Role(this.server, data)
        this.cache.set(role.id, role)
        return role
    }

    async create(name: string): Promise<Role> {
        const { id, role } = await this.client.api.post(`/servers/${this.server.id}/roles`, { body: { name } })
        return this._add(Object.assign(role, { id }))
    }

    async delete(role: RoleResolvable): Promise<void> {
        const id = this.resolveId(role)
        if (!id) throw new TypeError('INVALID_TYPE', 'role', 'RoleResolvable')
        await this.client.api.delete(`/servers/${this.server.id}/roles/${id}`)
    }
}
