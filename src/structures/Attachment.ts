import type { API } from '../../deps.ts'
import { Base } from './Base.ts'
import { Client } from '../client/Client.ts'

export class Attachment extends Base<API.File> {
    filename!: string
    type!: string
    size!: number
    metadata!: API.File['metadata']

    constructor(client: Client, data: API.File) {
        super(client);
        this._patch(data);
    }

    equals(that?: this | null): boolean {
        if (!that) return false
        return (
            this.id === that.id &&
            this.type === that.type &&
            this.size === that.size
        )
    }

    protected _patch(data: API.File): this {
        super._patch(data)
        if (data.filename) this.filename = data.filename
        if (data.content_type) this.type = data.content_type
        if (typeof data.size === 'number') this.size = data.size
        if (data.metadata) this.metadata = data.metadata
        return this
    }
}