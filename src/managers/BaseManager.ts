import type { Client } from '../client/Client.ts';
import { Collection } from '../util/mod.ts';

export abstract class BaseManager<Holds extends { id: string }, R = unknown> {
  readonly cache = new Collection<string, Holds>();

  constructor(protected readonly client: Client) {}

  _add(raw: R): Holds {
    if (!this.holds) throw new Error('No "holds" exists.');
    const obj = new this.holds(this.client, raw);
    this.cache.set(obj.id, obj);
    return obj;
  }

  _remove(id: string): void {
    this.cache.delete(id);
  }

  // deno-lint-ignore no-explicit-any
  abstract readonly holds: (new (...args: any[]) => Holds) | null;

  resolve(resolvable: Holds): Holds | null;
  resolve(resolvable: string | R): Holds | null;
  resolve(resolvable: string | R | Holds): Holds | null;
  resolve(resolvable: string | R | Holds): Holds | null {
    const id = this.resolveId(resolvable);
    if (id) return this.cache.get(id) ?? null;
    return null;
  }

  resolveId(resolvable: string | Holds | R): string | null {
    if (resolvable == null) return null;
    if (typeof resolvable === 'string') return resolvable;
    if (this.holds && resolvable instanceof this.holds) return resolvable.id;
    const raw = resolvable as unknown as { _id: string };
    if (typeof raw === 'object' && '_id' in raw) raw._id ?? null;
    return null;
  }

  valueOf(): this['cache'] {
    return this.cache;
  }
}
