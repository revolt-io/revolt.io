import type { Client } from '../client/Client'
import { Collection } from '../util/index'

export abstract class BaseManager<Holds extends { id: string }, R = unknown> {
    readonly cache = new Collection<string, Holds>()

    constructor(protected readonly client: Client) {}

    _add(raw: R): Holds {
        if (!this.holds) throw new Error('No "holds" exists.')
        const obj = new this.holds(this.client, raw)
        this.cache.set(obj.id, obj)
        return obj
    }

    _remove(id: string): void {
        this.cache.delete(id)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract readonly holds: (new (...args: any[]) => Holds) | null

    resolve(resolvable: Holds): Holds | null
    resolve(resolvable: string | R): Holds | null
    resolve(resolvable: string | R | Holds): Holds | null
    resolve(resolvable: string | R | Holds): Holds | null {
        if (resolvable == null) return null
        if (typeof resolvable === 'string') return this.cache.get(resolvable) ?? null
        if (this.holds && resolvable instanceof this.holds) return resolvable
        const raw = resolvable as unknown as { _id: string }
        if ('_id' in raw) return this.cache.get(raw._id) ?? null
        return null
    }

    resolveId(resolvable: string | Holds | R): string | null {
        if (resolvable == null) return null
        if (typeof resolvable === 'string') return resolvable
        if (this.holds && resolvable instanceof this.holds) return resolvable.id
        const raw = resolvable as unknown as { _id: string }
        if ('_id' in raw) raw._id ?? null
        return null
    }

    valueOf(): this['cache'] {
        return this.cache
    }
}
