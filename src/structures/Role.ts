import { Role as RawRole } from 'revolt-api/types/Servers'
import { Base, Server } from '.'

export class Role extends Base {
    id!: string
    name!: string
    color: string | null = null
    constructor(public server: Server, data: RawRole & { id: string }) {
        super(server.client)
        this._patch(data)
    }

    _patch(data: RawRole & { id?: string }): this {
        if (data.id) {
            this.id = data.id
        }

        if (data.name) {
            this.name = data.name
        }

        if ('colour' in data) {
            this.color = data.colour ?? null
        }

        return this
    }

    _update(data: RawRole & { id: string }): this {
        const clone = this._clone()
        clone._patch(data)
        return clone
    }

    async delete(): Promise<void> {
        await this.server.roles.delete(this)
    }

    toString(): string {
        return `<@&${this.id}>`
    }
}
