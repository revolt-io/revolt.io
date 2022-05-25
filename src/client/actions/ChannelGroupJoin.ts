import { Action } from './Action'
import { Events } from '../../util/Constants'

export class ChannelGroupJoinAction extends Action {
    async handle(data: { id: string; user: string }): Promise<unknown> {
        const channel = this.client.channels.cache.get(data.id)
        const user = await this.client.users.fetch(data.user, { force: false })

        if (channel?.isGroup()) {
            channel.users.set(user.id, user)
            this.client.emit(Events.GROUP_JOIN, channel, user)
        }

        return { channel, user }
    }
}
