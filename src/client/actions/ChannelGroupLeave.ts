import { Action } from './Action'
import { GroupChannel } from '../../structures'
import { Events } from '../../util'

export class ChannelGroupLeaveAction extends Action {
    handle(data: { id: string; user: string }): unknown {
        const group = this.client.channels.cache.get(data.id) as GroupChannel
        const user = this.client.users.cache.get(data.user)

        if (group) {
            group._users = group._users.filter(id => id !== data.user)
        }

        if (group && user) {
            this.client.emit(Events.GROUP_LEAVE, group, user)
        }

        return { group, user }
    }
}
