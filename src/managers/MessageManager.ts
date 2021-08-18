import { Message as RawMessage } from 'revolt-api/types/Channels'
import { User as RawUser } from 'revolt-api/types/Users'
import { TypeError } from '../errors'
import { Channel, Message, User } from '../structures'
import { Collection } from '../util/Collection'
import { UUID } from '../util/UUID'
import { BaseManager } from './BaseManager'

export type MessageResolvable = Message | RawMessage | string

export interface EditMessageOptions {
    content?: string
}

export interface MessageOptions {
    content: string
    replies?: unknown[]
    attachments?: string[]
}

export interface SerachMessageQuery {
    query: string
    limit?: number
    before?: string
    after?: string
    sort?: 'Relevance' | 'Latest' | 'Oldest'
    include_users?: boolean
}

export class MessageManager extends BaseManager<string, Message, RawMessage> {
    holds = Message
    client = this.channel.client
    constructor(public channel: Channel) {
        super()
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
        const messageId = this.resolveId(message)
        if (!messageId) throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable')
        await this.client.api.put(`/channels/${this.channel.id}/ack/${messageId}`)
    }

    async delete(message: MessageResolvable): Promise<void> {
        const messageId = this.resolveId(message)
        if (!messageId) throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable')
        await this.client.api.delete(`/channels/${this.channel.id}/messages/${messageId}`)
    }

    async edit(message: MessageResolvable, options: EditMessageOptions): Promise<void> {
        const messageId = this.resolveId(message)
        if (!messageId) throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable')
        await this.client.api.patch(`/channels/${this.channel.id}/messages/${messageId}`, {
            body: options
        })
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

    search(query: SerachMessageQuery & { include_users: true }): Promise<{
        users: Collection<string, User>
        messages: Collection<string, Message>
    }>
    search(query: SerachMessageQuery & { include_users?: false }): Promise<Collection<string, Message>>
    async search(query: SerachMessageQuery): Promise<
        | Collection<string, Message>
        | {
              users: Collection<string, User>
              messages: Collection<string, Message>
          }
    > {
        const response = await this.client.api.post(`/channels/${this.channel.id}/search`, {
            body: query
        })

        if (query.include_users) {
            const users = (response.users as RawUser[]).reduce((coll, cur) => {
                const user = this.client.users._add(cur)
                coll.set(user.id, user)
                return coll
            }, new Collection<string, User>())

            const messages = (response.messages as RawMessage[]).reduce((coll, cur) => {
                const msg = this._add(cur)
                coll.set(msg.id, msg)
                return coll
            }, new Collection<string, Message>())

            return {
                messages,
                users
            }
        } else {
            return (response as RawMessage[]).reduce((coll, cur) => {
                const msg = this._add(cur)
                coll.set(msg.id, msg)
                return coll
            }, new Collection<string, Message>())
        }
    }

    private async _fetchId(messageId: string) {
        const data = await this.client.api.get(`/channels/${this.channel.id}/messages/${messageId}`)
        return this._add(data)
    }

    private async _fetchMany(withUsers = true) {
        const { messages } = await this.client.api.get(`/channels/${this.channel.id}/messages?include_users=${withUsers}`)
        return (messages as RawMessage[]).reduce((coll, cur) => {
            const msg = this._add(cur)
            coll.set(msg.id, msg)
            return coll
        }, new Collection<string, Message>())
    }
}
