import type { Member as APIMember } from 'revolt-api'
import { Action } from './Action'
import { Events } from '../../util/Constants'

export class ServerMemberUpdateAction extends Action {
    handle(data: { id: string; data: APIMember }): unknown {
        const server = this.client.servers.cache.get(data.id)
        const oldMember = server?.members.cache.get(data.data?._id?.user)

        if (server && oldMember) {
            const newMember = oldMember._update(data.data)

            server.members.cache.set(newMember.id, newMember)

            this.client.emit(Events.SERVER_MEMBER_UPDATE, oldMember, newMember)

            return { newMember, oldMember }
        }

        return { oldMember }
    }
}
