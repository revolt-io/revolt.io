import { Message as RawMessage } from 'revolt-api/types/Channels'
import { Embed } from 'revolt-api/types/January'
import { Base, DMChannel, GroupChannel, Server, TextChannel, User } from '.'
import { Client } from '..'
import { MessageTypes } from '../util/Constants'
import { UUID } from '../util/UUID'
import { Mentions } from './Mentions'
import { ServerMember } from './ServerMember'

export class Message extends Base {
    content = ''
    id!: string
    channelId!: string
    authorId!: string
    embeds: Embed[] = []
    deleted = false
    mentions = new Mentions(this)
    type: MessageTypes | 'UNKNOWN' = MessageTypes.TEXT
    editedAt: Date | null = null
    constructor(client: Client, data: RawMessage) {
        super(client)
        this._patch(data)
    }

    _update(data: RawMessage): this {
        const clone = this._clone()
        clone._patch(data)
        return clone
    }

    _patch(data: RawMessage): this {
        if (!data) return this

        if (data._id) {
            this.id = data._id
        }

        if (Array.isArray(data.embeds)) {
            this.embeds = data.embeds
        }

        if (Array.isArray(data.mentions)) {
            this.mentions._patch(data.mentions)
        }

        if (data.author) {
            this.authorId = data.author
        }

        if (data.channel) {
            this.channelId = data.channel
        }

        if (typeof data.content === 'object') {
            this.type = MessageTypes[data.content.type.toUpperCase() as keyof typeof MessageTypes] ?? 'UNKNOWN'
        } else if (typeof data.content === 'string') {
            this.content = data.content
        }

        if (data.edited) {
            this.editedAt = new Date(data.edited.$date)
        }

        return this
    }

    get createdAt(): Date {
        return UUID.extrectTime(this.id)
    }

    get createdTimestamp(): number {
        return this.createdAt.getTime()
    }

    get editedTimestamp(): number | null {
        return this.editedAt?.getTime() ?? null
    }

    async ack(): Promise<void> {
        await this.channel.messages.ack(this)
    }

    async delete(): Promise<void> {
        await this.channel.messages.delete(this)
    }

    async reply(content: string, mention = true): Promise<unknown> {
        return this.channel.messages.send({
            content,
            replies: [{ id: this.id, mention }]
        })
    }

    fetch(): Promise<Message> {
        return this.channel.messages.fetch(this.id)
    }

    async edit(content: string): Promise<void> {
        await this.channel.messages.edit(this, { content })
    }

    get author(): User | null {
        return this.client.users.cache.get(this.authorId) ?? null
    }

    get channel(): TextChannel | DMChannel | GroupChannel {
        return this.client.channels.cache.get(this.channelId) as TextChannel
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
