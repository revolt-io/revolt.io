import { Client } from '../client/Client'
import { Collection } from '../util/Collection'

export abstract class BaseManager<K, Holds, R extends unknown = unknown> {
    readonly cache = new Collection<K, Holds>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract readonly holds: (new (...args: any[]) => Holds) | null
    abstract readonly client: Client

    _add(raw: R): Holds {
        if (!this.holds) {
            throw new Error('No "holds" exists.')
        }
        const obj = new this.holds(this.client, raw)
        this.cache.set((obj as Holds & { id: K }).id, obj)
        return obj
    }

    _remove(id: K): void {
        this.cache.delete(id)
    }

    resolve(resolvable: Holds): Holds | null
    resolve(resolvable: K | R): Holds | null
    resolve(resolvable: K | R | Holds): Holds | null
    resolve(resolvable: K | R | Holds): Holds | null {
        if (this.holds && resolvable instanceof this.holds) return resolvable
        const raw = resolvable as unknown as { _id: K }
        if ('_id' in raw) return this.cache.get(raw._id) ?? null
        if (typeof resolvable === 'string') return this.cache.get(resolvable as K) ?? null
        return null
    }

    resolveId(resolvable: K | Holds | R): K | null {
        if (typeof resolvable === 'string') return resolvable as K
        if (this.holds && resolvable instanceof this.holds) return (resolvable as Holds & { id: K }).id
        const raw = resolvable as unknown as { _id: K }
        if ('_id' in raw) raw._id ?? null
        return null
    }

    valueOf(): this['cache'] {
        return this.cache
    }
}
