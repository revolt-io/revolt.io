import { Channel as RawChannel, Message as RawMessage } from 'revolt-api/types/Channels'
import { User as RawUser } from 'revolt-api/types/Users'
import { Server as RawServer } from 'revolt-api/types/Servers'
import { BaseManager } from '../../managers'
import { Channel, DMChannel, GroupChannel, Message, TextChannel, User, Server } from '../../structures'
import type { Client } from '../Client'

export abstract class Action {
    constructor(public client: Client) {}
    abstract handle(data: unknown): unknown

    getPayload(data: unknown, manager: BaseManager<unknown, unknown>, id: string): unknown {
        const existing = manager.cache.get(id)

        if (!existing) {
            return manager._add(data as { _id: string })
        }

        return existing
    }

    getChannel(data: RawChannel | Channel): Channel {
        if (data instanceof Channel) return data

        const id = this.client.channels.resolveId(data)

        return this.getPayload(data, this.client.channels, id) as Channel
    }

    getMessage(data: RawMessage | Message, channel: TextChannel | DMChannel | GroupChannel): Message {
        const id = channel.messages.resolveId(data)
        return this.getPayload(data, channel.messages, id) as Message
    }

    getServer(data: RawServer | Server): Server {
        if (data instanceof Server) return data
        const id = this.client.servers.resolveId(data)
        return this.getPayload(data, this.client.servers, id) as Server
    }

    getUser(data: User | RawUser): User {
        if (data instanceof User) return data
        const id = this.client.users.resolveId(data)
        return this.getPayload(data, this.client.users, id) as User
    }

    // getMember() {}
}
