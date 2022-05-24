import { User as APIUser } from 'revolt-api'
import { Action } from './Action'
import { Events } from '../../util/Constants'

export class UserUpdateAction extends Action {
    handle(data: { id: string; data: APIUser }): unknown {
        const oldUser = this.client.users.cache.get(data.id)

        if (oldUser) {
            const newUser = oldUser._update(data.data)

            this.client.users.cache.set(newUser.id, newUser)
            this.client.emit(Events.USER_UPDATE, oldUser, newUser)

            return { newUser, oldUser }
        }

        return { oldUser }
    }
}
