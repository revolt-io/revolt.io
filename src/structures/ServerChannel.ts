import { ServerChannel as RawServerChannel } from 'revolt-api/types/Channels'
import { Channel } from './Channel'
import { Client } from '../client/Client'
import { Server } from '.'

export class ServerChannel extends Channel {
    name: string
    serverId: string
    description: string | null
    constructor(client: Client, raw: RawServerChannel) {
        super(client, Object.create(raw))
        this.serverId = raw.server
        this.name = raw.name
        this.description = raw.description ?? null
    }

    get server(): Server | null {
        return this.client.servers.cache.get(this.serverId)
    }

    async createInvite(): Promise<string> {
        const { code } = await this.client.api.post(`/channels/${this.id}/invites`)
        return `https://app.revolt.chat/invite/${code}`
    }

    // edit() {}
}
