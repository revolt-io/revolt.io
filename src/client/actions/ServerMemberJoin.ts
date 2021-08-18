import { Action } from './Action'
import { Events } from '../../util/Constants'

export class ServerMemberJoin extends Action {
    async handle(data: { id: string; user: string }): Promise<unknown> {
        let server = this.client.servers.cache.get(data.id)

        if (!server) {
            server = await this.client.servers.fetch(data.id)
            this.client.emit(Events.SERVER_CREATE, server)
        }

        const member = await server.members.fetch(data.user)

        server.members.cache.set(member.id, member)

        this.client.emit(Events.SERVER_MEMBER_JOIN, member)

        return { member }
    }
}
