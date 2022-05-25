import { User as APIUser, Message as APIMessage, Member as APIMember } from 'revolt-api'
import { BaseManager } from './BaseManager'
import { TypeError } from '../errors/index'
import { Channel, Message, ServerMember, User } from '../structures/index'
import { Collection, UUID } from '../util/index'

export type MessageResolvable = Message | APIMessage | string

export interface EditMessageOptions {
    content?: string
}

export interface MessageOptions {
    content: string
    replies?: unknown[]
    attachments?: string[]
}

export interface SearchMessageQuery {
    query: string
    limit?: number
    before?: string
    after?: string
    sort?: 'Relevance' | 'Latest' | 'Oldest'
    include_users?: boolean
}

type SearchResultWithUsers = {
    users: Collection<string, User>
    messages: Collection<string, Message>
    members: Collection<string, ServerMember>
}

export class MessageManager extends BaseManager<Message, APIMessage> {
    holds = Message
    constructor(protected readonly channel: Channel) {
        super(channel.client)
    }

    private async _fetchId(messageId: string) {
        const data = await this.client.api.get(`/channels/${this.channel.id}/messages/${messageId}`)
        return this._add(data)
    }

    private async _fetchMany(withUsers = true) {
        const { messages } = await this.client.api.get(`/channels/${this.channel.id}/messages?include_users=${withUsers}`)
        return (messages as APIMessage[]).reduce((coll, cur) => {
            const msg = this._add(cur)
            coll.set(msg.id, msg)
            return coll
        }, new Collection<string, Message>())
    }

    async send(_options: MessageOptions | string): Promise<Message> {
        const { content, replies, attachments }: MessageOptions =
            typeof _options === 'object'
                ? { ..._options }
                : {
                      content: _options
                  }

        const data = await this.client.api.post(`/channels/${this.channel.id}/messages`, {
            body: {
                content,
                nonce: UUID.generate(),
                replies,
                attachments
            }
        })

        return this._add(data)
    }

    async ack(message: MessageResolvable): Promise<void> {
        const id = this.resolveId(message)
        if (!id) throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable')
        await this.client.api.put(`/channels/${this.channel.id}/ack/${id}`)
    }

    async delete(message: MessageResolvable): Promise<void> {
        const id = this.resolveId(message)
        if (!id) throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable')
        await this.client.api.delete(`/channels/${this.channel.id}/messages/${id}`)
    }

    async edit(message: MessageResolvable, options: EditMessageOptions): Promise<void> {
        const id = this.resolveId(message)
        if (!id) throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable')
        await this.client.api.patch(`/channels/${this.channel.id}/messages/${id}`, { body: options })
    }

    async search(query: SearchMessageQuery & { include_users: true }): Promise<SearchResultWithUsers>
    async search(query: SearchMessageQuery): Promise<Collection<string, Message>>
    async search(query: SearchMessageQuery): Promise<Collection<string, Message> | SearchResultWithUsers> {
        if (query.include_users) {
            const response = (await this.client.api.post(`/channels/${this.channel.id}/search`, { body: query })) as {
                users: APIUser[]
                messages: APIMessage[]
                members: APIMember[]
            }

            const users = response.users.reduce((coll, cur) => {
                const user = this.client.users._add(cur)
                coll.set(user.id, user)
                return coll
            }, new Collection<string, User>())

            const messages = response.messages.reduce((coll, cur) => {
                const msg = this._add(cur)
                coll.set(msg.id, msg)
                return coll
            }, new Collection<string, Message>())

            const server = this.client.servers.cache.get(response.members[0]?._id.server)

            if (server) {
                const members = response.members.reduce((coll, cur) => {
                    const member = server!.members._add(cur)
                    coll.set(cur._id.user, member)
                    return coll
                }, new Collection<string, ServerMember>())

                return { messages, users, members }
            }

            return { messages, users, members: new Collection() }
        }

        const response = (await this.client.api.post(`/channels/${this.channel.id}/search`, { body: query })) as APIMessage[]

        return response.reduce((coll, cur) => {
            const msg = this._add(cur)
            coll.set(msg.id, msg)
            return coll
        }, new Collection<string, Message>())
    }

    fetch(messageId: string): Promise<Message>
    fetch(options: { includeUsers: true }): Promise<{
        users: Collection<string, User>
        messages: Collection<string, Message>
    }>
    fetch(options?: { includeUsers?: false }): Promise<Collection<string, Message>>
    fetch(options?: string | { includeUsers?: boolean }): Promise<
        | Collection<string, Message>
        | {
              users: Collection<string, User>
              messages: Collection<string, Message>
          }
        | Message
    > {
        return typeof options === 'string' ? this._fetchId(options) : this._fetchMany(options?.['includeUsers'])
    }
}
