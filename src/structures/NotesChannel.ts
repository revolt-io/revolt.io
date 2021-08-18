import { SavedMessagesChannel as RawNotesChannel } from 'revolt-api/types/Channels'
import { User } from '.'
import { TextBasedChannel } from './interfaces/TextBasedChannel'
import { Client } from '../client/Client'
import { ChannelTypes } from '../util'

export class NotesChannel extends TextBasedChannel {
    userId!: string
    readonly type = ChannelTypes.NOTES
    constructor(client: Client, data: RawNotesChannel) {
        super(client, data)
        this._patch(data)
    }

    _patch(data: RawNotesChannel): this {
        if (data._id) {
            this.id = data._id
        }

        if (data.user) {
            this.userId = data.user
        }

        return this
    }

    _update(data: RawNotesChannel): this {
        const clone = this._clone()
        clone._patch(data)
        return clone
    }

    get user(): User | null {
        return this.client.users.cache.get(this.userId) ?? null
    }
}
