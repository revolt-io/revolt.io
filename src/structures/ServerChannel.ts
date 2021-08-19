import { ServerChannel as RawServerChannel } from 'revolt-api/types/Channels'
import { Channel, Server, Category } from '.'
import { ChannelPermissions, Collection } from '../util'

export class ServerChannel extends Channel {
    name!: string
    serverId!: string
    description: string | null = null
    icon: string | null = null
    overwrites = new Collection<string, ChannelPermissions>()
    constructor(public server: Server, data: RawServerChannel) {
        super(server.client, Object.create(data))
        this._patch(data)
    }

    // TODO: Add channel overwrites
    _patch(data: RawServerChannel): this {
        if (data.name) {
            this.name = data.name
        }

        if (data.server) {
            this.serverId = data.server
        }

        if ('description' in data) {
            this.description = data.description ?? null
        }

        if ('icon' in data) {
            this.icon = data.icon?._id ?? null
        }

        return this
    }

    _update(data: RawServerChannel): this {
        const clone = this._clone()
        clone._patch(data)
        return clone
    }

    async createInvite(): Promise<string> {
        const { code } = await this.client.api.post(`/channels/${this.id}/invites`)
        return this.client.endpoints.invite(code)
    }

    iconURL(options?: { size: number }): string | null {
        return this.icon ? this.client.endpoints.icon(this.icon, options?.size) : null
    }

    get category(): Category | null {
        return this.server.categories.find(cat => cat._channels.includes(this.id)) ?? null
    }
}
