import { Action } from './Action'
import { GroupChannel } from '../../structures'
import { Events } from '../../util/Constants'

export class ChannelGroupJoinAction extends Action {
    async handle(data: { id: string; user: string }): Promise<unknown> {
        const group = this.client.channels.cache.get(data.id) as GroupChannel

        group?._users.push(data.user)

        if (group) {
            const user = await this.client.users.fetch(data.user, { force: false })
            this.client.emit(Events.GROUP_JOIN, group, user)
            return { group, user }
        }

        return { group }
    }
}
