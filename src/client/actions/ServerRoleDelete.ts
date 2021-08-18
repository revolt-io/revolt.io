import { Action } from './Action'
import { Events } from '../../util/Constants'

export class ServerRoleDeleteAction extends Action {
    handle(data: { id: string; role_id: string }): unknown {
        const server = this.client.servers.cache.get(data.id)

        if (server) {
            const role = server.roles.cache.get(data.role_id)

            if (role) {
                server.roles._remove(role.id)
                this.client.emit(Events.ROLE_DELETE, role)
            }

            return { role }
        }

        return {}
    }
}
