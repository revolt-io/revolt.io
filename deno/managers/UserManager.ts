import type { User as APIUser } from 'https://deno.land/x/revolt_api@0.4.0/types.ts'
import { BaseManager } from './BaseManager.ts'
import { TypeError } from '../errors/index.ts'
import { Message, User } from '../structures/index.ts'

export type UserResolvable = User | APIUser | Message | string

export class UserManager extends BaseManager<User, APIUser> {
    holds = User

    async fetch(user: UserResolvable, { force = true } = {}): Promise<User> {
        const userId = this.resolveId(user)

        if (!userId) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable')

        if (!force) {
            const user = this.cache.get(userId)
            if (user) return user
        }

        const data = (await this.client.api.get(`/users/${userId}`)) as APIUser

        return this._add(data)
    }

    resolve(resolvable: Message | User): User
    resolve(resolvable: string | APIUser): User | null
    resolve(resolvable: User | APIUser | string | Message): User | null {
        if (resolvable instanceof Message) return resolvable.author
        return super.resolve(resolvable)
    }

    resolveId(resolvable: UserResolvable): string | null {
        if (resolvable instanceof Message) return resolvable.authorId
        return super.resolveId(resolvable)
    }
}
