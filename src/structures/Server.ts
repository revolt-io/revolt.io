import { Role as RawRole, Server as RawServer } from 'revolt-api/types/Servers'
import { Base, ServerMember, User } from '.'
import { Client } from '..'
import { RoleManager, ServerChannelManager, ServerMemberManager } from '../managers'
import { ServerPermissions, UUID } from '../util'

export class Server extends Base {
    name!: string
    id!: string
    description: string | null = null
    ownerId!: string
    members = new ServerMemberManager(this)
    channels: ServerChannelManager
    roles: RoleManager
    deleted = false
    icon: string | null = null
    banner: string | null = null
    permissions!: ServerPermissions
    _channels: string[] = []
    _roles: Record<string, RawRole> = {}

    constructor(client: Client, data: RawServer) {
        super(client)
        this._patch(data)
        this.channels = new ServerChannelManager(this)
        this.roles = new RoleManager(this)
    }

    _patch(data: RawServer): this {
        if (!data) return this

        if (data._id) {
            this.id = data._id
        }

        if ('icon' in data) {
            this.icon = data.icon?._id ?? null
        }

        if ('banner' in data) {
            this.banner = data.banner?._id ?? null
        }

        if (data.owner) {
            this.ownerId = data.owner
        }

        if (data.name) {
            this.name = data.name
        }

        if ('description' in data) {
            this.description = data.description ?? null
        }

        if (Array.isArray(data.channels)) {
            this._channels = data.channels
        }

        if (typeof data.roles === 'object') {
            this._roles = data.roles
        }

        if (Array.isArray(data.default_permissions) && typeof data.default_permissions[0] === 'number') {
            this.permissions = new ServerPermissions(data.default_permissions[0]).freeze()
        }

        return this
    }

    _update(data: RawServer): this {
        const clone = this._clone()
        clone._patch(data)
        return clone
    }

    async ack(): Promise<void> {
        await this.client.servers.ack(this)
    }

    async delete(): Promise<void> {
        await this.client.servers.delete(this)
    }

    iconURL(options?: { size: number }): string | null {
        return this.icon && this.client.endpoints.icon(this.icon, options?.size)
    }

    bannerURL(options?: { size: number }): string | null {
        return this.banner && this.client.endpoints.banner(this.banner, options?.size)
    }

    get me(): ServerMember | null {
        return this.members.cache.get(this.client.user?.id as string) ?? null
    }

    get createdAt(): Date {
        return UUID.extrectTime(this.id)
    }

    get createdTimestamp(): number {
        return this.createdAt.getTime()
    }

    get owner(): User | null {
        return this.client.users.cache.get(this.ownerId) ?? null
    }

    toString(): string {
        return this.name
    }
}
