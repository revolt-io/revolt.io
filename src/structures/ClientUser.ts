import { User } from '.'

const SelfError = (x: string) => new TypeError(`You cannot "${x}" yourself`)

export class ClientUser extends User {
    async setUsername(username: string, password: string): Promise<void> {
        await this.client.api.patch(`/users/${this.id}/username`, {
            body: {
                username,
                password
            }
        })
    }

    async block(): Promise<void> {
        throw SelfError('block')
    }

    async unblock(): Promise<void> {
        throw SelfError('unblock')
    }
}
