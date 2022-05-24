import { Channel as APIChannel } from 'revolt-api'
import { Category, Channel, Server } from '.'
import { Client } from '../client/Client'
import { ChannelPermissions, Collection } from '../util'

type APIServerChannel = Extract<APIChannel, { channel_type: 'TextChannel' | 'VoiceChannel' }>

export class ServerChannel<T extends APIServerChannel = APIServerChannel> extends Channel<T> {
    name!: string
    serverId!: string
    description: string | null = null
    icon: string | null = null
    overwrites = new Collection<string, ChannelPermissions>()
    nsfw = false
    constructor(client: Client, data: T) {
        super(client, data)
        this._patch(data)
    }

    // TODO: Add channel overwrites
    protected _patch(data: T): this {
        super._patch(data)

        if (data.name) this.name = data.name
        if (data.server) this.serverId = data.server
        if ('description' in data) this.description = data.description ?? null
        if ('icon' in data) this.icon = data.icon?._id ?? null
        if (typeof data.nsfw === 'boolean') this.nsfw = data.nsfw

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
