import { Message as APIMessage, SystemMessage, Embed } from 'revolt-api'
import { Base, DMChannel, GroupChannel, Mentions, Server, ServerMember, TextChannel, User } from './index'
import { Client } from '../client/Client'
import { UUID } from '../util/index'

export class Message extends Base<APIMessage> {
    content = ''
    channelId!: string
    authorId!: string
    embeds: Embed[] = []
    mentions = new Mentions(this, [])
    type: Uppercase<SystemMessage['type']> = 'TEXT'
    editedAt: Date | null = null
    constructor(client: Client, data: APIMessage) {
        super(client)
        this._patch(data)
    }

    protected _patch(data: APIMessage): this {
        super._patch(data)

        if (Array.isArray(data.embeds)) {
            this.embeds = data.embeds
        }

        if (Array.isArray(data.mentions)) {
            this.mentions = new Mentions(this, data.mentions)
        }

        if (data.author) {
            this.authorId = data.author
        }

        if (data.channel) {
            this.channelId = data.channel
        }

        if (typeof data.content === 'string') {
            this.content = data.content
        }

        if (data.system) {
            this.type = data.system.type.toUpperCase() as Uppercase<SystemMessage['type']>
        }

        if (data.edited) {
            this.editedAt = new Date(data.edited)
        }

        return this
    }

    get createdAt(): Date {
        return UUID.timestampOf(this.id)
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

    async edit(content: string): Promise<void> {
        await this.channel.messages.edit(this, { content })
    }

    fetch(): Promise<Message> {
        return this.channel.messages.fetch(this.id)
    }

    get system(): boolean {
        return this.type !== 'TEXT'
    }

    inServer(): this is this & { serverId: string; server: Server; channel: TextChannel } {
        return this.channel.inServer()
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
        return `https://app.revolt.chat/${this.serverId ? `server/${this.serverId}` : ''}/channel/${this.channelId}/${this.id}`
    }
}
