import { Message, ServerMember, User } from './index.ts'
import { Client } from '../client/Client.ts'
import { TypeError } from '../errors/index.ts'
import { UserResolvable } from '../managers/index.ts'
import { Collection } from '../util/index.ts'

export class Mentions {
    public readonly client: Client

    constructor(public message: Message, protected _users: string[]) {
        this.client = message.client
    }

    has(user: UserResolvable): boolean {
        const id = this.client.users.resolveId(user)
        if (!id) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable')
        return this._users.includes(id)
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
