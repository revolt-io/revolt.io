import { Events } from '../../util/Constants'
import { Action } from './Action'

export class ServerMemberLeaveAction extends Action {
    handle(data: { id: string; user: string }): unknown {
        const server = this.client.servers.cache.get(data.id)

        if (server) {
            const member = server.members.cache.get(data.user)

            if (member) {
                server.members._remove(member.id)
                this.client.emit(Events.SERVER_MEMBER_LEAVE, member)
            }

            return { server, member }
        }

        return { server }
    }
}
