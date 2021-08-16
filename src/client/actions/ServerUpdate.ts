import { Action } from './Action'
import { Server as RawServer } from 'revolt-api/types/Servers'
import { Events } from '../../util/Constants'

export class ServerUpdateAction extends Action {
    handle(data: { id: string; data: RawServer }): unknown {
        const oldServer = this.client.servers.cache.get(data.id)

        if (oldServer) {
            const newServer = oldServer._update(data.data)

            this.client.servers.cache.set(newServer.id, newServer)

            this.client.emit(Events.SERVER_UPDATE, oldServer, newServer)

            return { newServer, oldServer }
        }

        return { oldServer }
    }
}
