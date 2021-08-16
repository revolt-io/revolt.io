import { ServerChannel as RawServerChannel } from 'revolt-api/types/Channels'
import { Channel } from './Channel'
import { Client } from '../client/Client'
import { Server } from '.'

export class ServerChannel extends Channel {
    name!: string
    serverId!: string
    description: string | null = null
    constructor(client: Client, data: RawServerChannel) {
        super(client, Object.create(data))
        this._patch(data)
    }

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

        return this
    }

    _update(data: RawServerChannel): this {
        const clone = this._clone()
        clone._patch(data)
        return clone
    }

    get server(): Server | null {
        return this.client.servers.cache.get(this.serverId) ?? null
    }

    async createInvite(): Promise<string> {
        const { code } = await this.client.api.post(`/channels/${this.id}/invites`)
        return `https://app.revolt.chat/invite/${code}`
    }
}
