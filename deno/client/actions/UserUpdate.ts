import type { User as APIUser } from 'https://deno.land/x/revolt_api@0.4.0/types.ts'
import { Action } from './Action.ts'
import { ClientUser } from '../../structures/ClientUser.ts'
import { Events } from '../../util/Constants.ts'

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
