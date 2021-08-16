import { Collection } from '../util/Collection'
import { Client } from '../client/Client'

export abstract class BaseManager<K, Holds, R extends unknown = unknown> {
    readonly cache = new Collection<K, Holds>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract readonly holds: new (...args: any[]) => Holds & { id: K }
    abstract readonly client: Client

    _add(raw: R): Holds {
        const obj = new this.holds(this.client, raw)
        this.cache.set(obj.id, obj)
        return obj
    }

    _remove(id: K): void {
        this.cache.delete(id)
    }

    resolve(resolvable: Holds): Holds
    resolve(resolvable: K | R): Holds | null
    resolve(resolvable: K | R | Holds): Holds | null
    resolve(resolvable: K | R | Holds): Holds | null {
        if (resolvable instanceof this.holds) return resolvable
        const raw = resolvable as unknown as { _id: K }
        if ('_id' in raw) return this.cache.get(raw._id) ?? null
        if (typeof resolvable === 'string') return this.cache.get(resolvable as K) ?? null
        return null
    }

    resolveId(resolvable: K | Holds | R): K | null {
        if (resolvable instanceof this.holds) return resolvable.id
        if (typeof resolvable === 'string') return resolvable as K
        const raw = resolvable as unknown as { _id: K }
        if ('_id' in raw) raw._id ?? null
        return null
    }

    valueOf(): this['cache'] {
        return this.cache
    }
}
