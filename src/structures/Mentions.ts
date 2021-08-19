import { Base, Message, ServerMember, User } from '.'
import { TypeError } from '../errors'
import { UserResolvable } from '../managers'
import { Collection } from '../util'

export class Mentions extends Base {
    private _users: string[] = []
    constructor(public message: Message) {
        super(message.client)
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
        if (!userId) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable')
        return this._users.includes(userId)
    }

    get members(): Collection<string, ServerMember> | null {
        const server = this.message.server

        if (!server) return null

        const members = new Collection<string, ServerMember>()

        for (const userId of this._users) {
            const member = server.members.cache.get(userId)
            if (member) members.set(member.id, member)
        }

        return members
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
