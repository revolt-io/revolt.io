import { Server as APIServer } from 'revolt-api'
import { Base, ServerMember, User, Category } from './index'
import { Client } from '../client/Client'
import { RoleManager, ServerChannelManager, ServerMemberManager } from '../managers/index'
import { Collection, ServerPermissions, UUID } from '../util/index'

export class Server extends Base<APIServer> {
    name!: string
    description: string | null = null
    ownerId!: string
    members = new ServerMemberManager(this)
    channels = new ServerChannelManager(this)
    roles = new RoleManager(this)
    icon: string | null = null
    banner: string | null = null
    analytics = false
    permissions!: ServerPermissions
    categories = new Collection<string, Category>()

    constructor(client: Client, data: APIServer) {
        super(client)
        this._patch(data)
    }

    protected _patch(data: APIServer): this {
        super._patch(data)

        if (Array.isArray(data.categories)) {
            this.categories.clear()
            for (const cat of data.categories) {
                const category = new Category(this, cat)
                this.categories.set(category.id, category)
            }
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
            for (const id of data.channels) {
                const channel = this.client.channels.cache.get(id)
                if (channel?.inServer()) this.channels.cache.set(channel.id, channel)
            }
        }

        if (typeof data.roles === 'object') {
            for (const [id, raw] of Object.entries(data.roles)) {
                this.roles._add(Object.assign(raw, { id }))
            }
        }

        if (typeof data.default_permissions === 'number') {
            this.permissions = new ServerPermissions(data.default_permissions).freeze()
        }

        if (typeof data.analytics === 'boolean') this.analytics = data.analytics

        return this
    }

    async ack(): Promise<void> {
        await this.client.servers.ack(this)
    }

    async delete(): Promise<void> {
        await this.client.servers.delete(this)
    }

    iconURL(options?: { size: number }): string | null {
        return this.icon ? this.client.endpoints.icon(this.icon, options?.size) : null
    }

    bannerURL(options?: { size: number }): string | null {
        return this.banner ? this.client.endpoints.banner(this.banner, options?.size) : null
    }

    get me(): ServerMember | null {
        return this.members.cache.get(this.client.user?.id as string) ?? null
    }

    get createdAt(): Date {
        return UUID.timestampOf(this.id)
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
