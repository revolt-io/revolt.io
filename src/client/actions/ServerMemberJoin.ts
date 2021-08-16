import { Events } from '../../util/Constants'
import { Action } from './Action'

export class ServerMemberJoin extends Action {
    async handle(data: { id: string; user: string }): Promise<unknown> {
        let server = this.client.servers.cache.get(data.id)

        if (!server) {
            server = await this.client.servers.fetch(data.id)
            this.client.emit(Events.SERVER_CREATE, server)
        }

        // Emit Member Join event

        return {}
    }
}
