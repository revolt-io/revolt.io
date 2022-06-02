import type { API } from '../../deps.ts';
import { Base, Server, ServerChannel } from './mod.ts';
import { Collection } from '../util/mod.ts';

export class Category extends Base {
  name!: string;
  protected _children: string[] = [];
  constructor(public readonly server: Server, data: API.Category) {
    super(server.client);
    this._patch(data);
  }

  protected _patch(data: API.Category): this {
    super._patch(data);

    if (data.title) {
      this.name = data.title;
    }

    if (Array.isArray(data.channels)) {
      this._children = data.channels;
    }

    return this;
  }

  get children(): Collection<string, ServerChannel> {
    const coll = new Collection<string, ServerChannel>();

    for (const childId of this._children) {
      const child = this.server.channels.cache.get(childId);
      if (child) coll.set(child.id, child);
    }

    return coll;
  }

  toString(): string {
    return this.name;
  }
}
