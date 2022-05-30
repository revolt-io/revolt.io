import type { API } from '../../deps.ts';
import { BaseManager } from './BaseManager.ts';
import { TypeError } from '../errors/mod.ts';
import { Message, User } from '../structures/mod.ts';

export type UserResolvable = User | API.User | Message | string;

export class UserManager extends BaseManager<User, API.User> {
  holds = User;

  async fetch(user: UserResolvable, { force = true } = {}): Promise<User> {
    const id = this.resolveId(user);

    if (!id) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable');

    if (!force) {
      const user = this.cache.get(id);
      if (user) return user;
    }

    const data = await this.client.api.get(`/users/${id}`) as API.User;

    return this._add(data);
  }

  resolve(resolvable: Message | User): User;
  resolve(resolvable: string | API.User): User | null;
  resolve(resolvable: User | API.User | string | Message): User | null {
    if (resolvable instanceof Message) return resolvable.author;
    return super.resolve(resolvable);
  }

  resolveId(resolvable: UserResolvable): string | null {
    if (resolvable instanceof Message) return resolvable.authorId;
    return super.resolveId(resolvable);
  }
}
