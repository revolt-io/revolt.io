import { Action } from './Action'
import { Events } from '../../util'

export class ChannelStartTypingAction extends Action {
    handle(data: { id: string; user: string }): unknown {
        const channel = this.client.channels.cache.get(data.id)
        const user = this.client.users.cache.get(data.user)

        if (channel?.isText() && user) {
            this.client.emit(Events.TYPING_START, channel, user)
        }

        return { channel, user }
    }
}
