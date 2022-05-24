import { Server as APIServer } from 'revolt-api'
import { Action } from './Action'
import { Events } from '../../util/Constants'

export class ServerDeleteAction extends Action {
    handle(data: APIServer): unknown {
        const server = this.client.servers.cache.get(data._id)

        if (server) {
            this.client.servers._remove(server.id)
            this.client.emit(Events.SERVER_DELETE, server)
        }

        return { server }
    }
}
