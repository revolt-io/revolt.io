import { Server as RawServer } from 'revolt-api/types/Servers'
import { Events } from '../../util/Constants'
import { Action } from './Action'

export class ServerDeleteAction extends Action {
    handle(data: RawServer): unknown {
        const server = this.client.servers.cache.get(data._id)

        if (server) {
            server.deleted = true

            this.client.servers._remove(server.id)

            for (const channelId of server._channels) {
                this.client.channels._remove(channelId)
            }

            this.client.emit(Events.SERVER_DELETE, server)
        }

        return { server }
    }
}
