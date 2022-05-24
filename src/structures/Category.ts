import { Category as APICategory } from 'revolt-api'
import { Base, Server, ServerChannel } from '.'
import { Collection } from '../util'

export class Category extends Base<APICategory> {
    name!: string
    protected _children: string[] = []
    constructor(public server: Server, data: APICategory) {
        super(server.client)
        this._patch(data)
    }

    protected _patch(data: APICategory): this {
        super._patch(data)

        if (data.title) {
            this.name = data.title
        }

        if (Array.isArray(data.channels)) {
            this._children = data.channels
        }

        return this
    }

    get children(): Collection<string, ServerChannel> {
        const coll = new Collection<string, ServerChannel>()

        for (const childId of this._children) {
            const child = this.server.channels.cache.get(childId)
            if (child) coll.set(child.id, child)
        }

        return coll
    }

    toString(): string {
        return this.name
    }
}
