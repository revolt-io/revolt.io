import { Base, User } from '.'
import { Client } from '../client/Client'
import { UserResolvable } from '../managers'
import { Collection } from '../util/Collection'

export class Mentions extends Base {
    private _users: string[] = []
    constructor(client: Client, userIds: string[]) {
        super(client)
        this._patch(userIds)
    }

    _patch(userIds: string[]): this {
        this._users.length = 0
        this._users.push(...userIds)
        return this
    }

    _update(userIds: string[]): this {
        const clone = this._clone()
        this._patch(userIds)
        return clone
    }

    has(user: UserResolvable): boolean {
        const userId = this.client.users.resolveId(user)
        return !!userId && this._users.includes(userId)
    }

    get users(): Collection<string, User> {
        const users = new Collection<string, User>()

        for (const userId of this._users) {
            const user = this.client.users.cache.get(userId)
            if (user) users.set(user.id, user)
        }

        return users
    }
}
