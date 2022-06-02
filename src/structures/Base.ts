import type { Client } from '../client/Client.ts';
import { BitField } from '../util/mod.ts';

type PartialObject = Partial<
  { _id: string } | { id: string } | { _id: { user: string } }
>;

export abstract class Base {
  id!: string;
  constructor(public readonly client: Client) {}

  equals(that?: this | null): boolean {
    if (!that) return false;

    for (const key in that) {
      const a = that[key], b = this[key];
      if (a instanceof Base && !a.equals(b as typeof a)) return false;
      if (
        a instanceof BitField &&
        a.bitfield !== (b as unknown as BitField).bitfield
      ) {
        return false;
      }

      // TODO: Add collection checking.
      if (typeof a === 'object' && a != null) continue;
      if (a !== b) return false;
    }

    return true;
  }

  _update(data: PartialObject, clear?: string[]): this {
    const clone = this._clone();
    this._patch(data, clear);
    return clone;
  }

  protected _patch(data: PartialObject, _clear?: string[]): this {
    if ('id' in data) this.id = data.id!;
    if ('_id' in data) {
      if (typeof data._id === 'string') this.id = data._id;
      if (typeof data._id === 'object') this.id = data._id.user;
    }
    return this;
  }

  _clone(): this {
    const clone = Object.assign(Object.create(this), this);

    for (const key in clone) {
      const prop = clone[key];
      if (prop instanceof Base) clone[key] = prop._clone();
    }

    return clone;
  }
}
