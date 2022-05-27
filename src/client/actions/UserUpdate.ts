import type { User as APIUser } from 'revolt-api'
import { Action } from './Action'
import { ClientUser } from '../../structures/ClientUser'
import { Events } from '../../util/Constants'

export class UserUpdateAction extends Action {
    handle(data: { id: string; data: APIUser }): unknown {
        const oldUser = this.client.users.cache.get(data.id)

        if (oldUser) {
            const newUser = oldUser._update(data.data)

            this.client.users.cache.set(newUser.id, newUser)

            if (data.id === this.client.user?.id) {
                this.client.user = new ClientUser(this.client, data.data)
            }

            this.client.emit(Events.USER_UPDATE, oldUser, newUser)

            return { newUser, oldUser }
        }

        return { oldUser }
    }
}
