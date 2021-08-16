import { Message as RawMessage } from 'revolt-api/types/Channels'
import { Embed } from 'revolt-api/types/January'
import { Base, DMChannel, GroupChannel, Server, TextChannel, User } from '.'
import { Client } from '..'
import { MessageTypes } from '../util/Constants'
import { UUID } from '../util/UUID'
import { ServerMember } from './ServerMember'

export class Message implements Base {
    content: string
    id: string
    channelId: string
    authorId: string
    embeds: Embed[] = []
    deleted = false
    type: MessageTypes | 'UNKNOWN' = MessageTypes.TEXT
    constructor(public client: Client, raw: RawMessage) {
        this.id = raw._id

        this.content = typeof raw.content === 'string' ? raw.content : ''

        if (typeof raw.content === 'object') {
            this.type = MessageTypes[raw.content.type.toUpperCase() as keyof typeof MessageTypes] ?? 'UNKNOWN'
        }

        this.embeds = Array.isArray(raw.embeds) ? raw.embeds : []
        this.channelId = raw.channel
        this.authorId = raw.author
    }

    get createdAt(): Date {
        return UUID.extrectTime(this.id)
    }

    get createdTimestamp(): number {
        return this.createdAt.getTime()
    }

    async ack(): Promise<void> {
        await this.channel.messages.ack(this)
    }

    async delete(): Promise<void> {
        await this.channel.messages.delete(this)
    }

    async reply(content: string, mention = true): Promise<unknown> {
        const raw = await this.client.api.post(`/channels/${this.channelId}/messages`, {
            body: {
                content,
                nonce: UUID.generate(),
                replies: [
                    {
                        id: this.id,
                        mention
                    }
                ]
            }
        })
        return new Message(this.client, raw)
    }

    fetch(): Promise<Message> {
        return this.channel.messages.fetch(this.id)
    }

    // TODO: Return instance message
    async edit(content: string): Promise<void> {
        await this.channel.messages.edit(this, { content })
    }

    get author(): User | null {
        return this.client.users.cache.get(this.authorId) ?? null
    }

    get channel(): TextChannel | DMChannel | GroupChannel {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.client.channels.cache.get(this.channelId)! as TextChannel
    }

    get serverId(): string | null {
        const channel = this.channel
        return channel.inServer() ? channel.serverId : null
    }

    get server(): Server | null {
        return this.client.servers.cache.get(this.serverId as string) ?? null
    }

    get member(): ServerMember | null {
        return this.server?.members.cache.get(this.authorId) ?? null
    }

    get url(): string {
        return `https://app.revolt.chat/${this.serverId ? `server/${this.serverId}` : ''}channel/${this.channelId}/${this.id}`
    }
}
