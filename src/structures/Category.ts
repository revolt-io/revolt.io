import { Category as RawCategory } from 'revolt-api/types/Servers'
import { Base, Server, ServerChannel } from '.'
import { Collection } from '../util'

export class Category extends Base {
    id!: string
    name!: string
    _channels: string[] = []
    constructor(public server: Server, data: RawCategory) {
        super(server.client)
        this._patch(data)
    }

    _patch(data: RawCategory): this {
        if (!data) return this

        if (data.id) {
            this.id = data.id
        }

        if (data.title) {
            this.name = data.title
        }

        if (Array.isArray(data.channels)) {
            this._channels = [...data.channels]
        }

        return this
    }

    _update(data: RawCategory): this {
        const clone = this._clone()
        clone._patch(data)
        return clone
    }

    get channels(): Collection<string, ServerChannel> {
        const coll = new Collection<string, ServerChannel>()

        for (const channelId of this._channels) {
            const channel = this.server.channels.cache.get(channelId)
            if (channel) coll.set(channel.id, channel)
        }

        return coll
    }

    toString(): string {
        return this.name
    }
}
