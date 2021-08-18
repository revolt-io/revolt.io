import { User as RawUser } from 'revolt-api/types/Users'
import { Client } from '../client/Client'
import { TypeError } from '../errors'
import { Message, User } from '../structures'
import { BaseManager } from './BaseManager'

export type UserResolvable = User | RawUser | Message | string

export class UserManager extends BaseManager<string, User, RawUser> {
    holds = User
    constructor(public client: Client) {
        super()
    }

    resolve(resolvable: Message | User): User
    resolve(resolvable: string | RawUser): User | null
    resolve(resolvable: User | RawUser | string | Message): User | null {
        if (resolvable instanceof Message) return resolvable.author
        return super.resolve(resolvable)
    }

    resolveId(resolvable: UserResolvable): string | null {
        if (resolvable instanceof Message) return resolvable.authorId
        return super.resolveId(resolvable)
    }

    async fetch(user: UserResolvable, { force = true } = {}): Promise<User> {
        const userId = this.resolveId(user)

        if (!userId) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable')

        if (!force) {
            const user = this.cache.get(userId)
            if (user) return user
        }

        const data = await this.client.api.get(`/users/${userId}`)

        return this._add(data)
    }
}
