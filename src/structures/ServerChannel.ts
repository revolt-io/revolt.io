import { Channel as APIChannel } from 'revolt-api'
import { Category, Channel, Server } from './index'
import { Client } from '../client/Client'
import { ChannelPermissions, Collection } from '../util'

type APIServerChannel = Extract<APIChannel, { channel_type: 'TextChannel' | 'VoiceChannel' }>

export interface Overwrite {
    allow: ChannelPermissions
    deny: ChannelPermissions
}

export class ServerChannel<T extends APIServerChannel = APIServerChannel> extends Channel<T> {
    name!: string
    serverId!: string
    description: string | null = null
    icon: string | null = null
    overwrites = new Collection<string, Overwrite>()
    nsfw = false
    constructor(client: Client, data: T) {
        super(client, data)
        this._patch(data)
    }

    protected _patch(data: T): this {
        super._patch(data)

        if (data.name) this.name = data.name
        if (data.server) this.serverId = data.server
        if ('description' in data) this.description = data.description ?? null
        if ('icon' in data) this.icon = data.icon?._id ?? null
        if (typeof data.nsfw === 'boolean') this.nsfw = data.nsfw
        if (data.role_permissions) {
            this.overwrites.clear()
            for (const [id, { a, d }] of Object.entries(data.role_permissions)) {
                this.overwrites.set(id, { allow: new ChannelPermissions(a), deny: new ChannelPermissions(d) })
            }
        }

        return this
    }

    async createInvite(): Promise<string> {
        const invite = await this.client.api.post(`/channels/${this.id}/invites`)
        return this.client.endpoints.invite(invite._id)
    }

    iconURL(options?: { size: number }): string | null {
        return this.icon ? this.client.endpoints.icon(this.icon, options?.size) : null
    }

    get server(): Server {
        return this.client.servers.cache.get(this.serverId) as Server
    }

    get category(): Category | null {
        return this.server.categories.find(cat => cat.children.has(this.id)) ?? null
    }
}
