import { Action } from './Action'
import { TextBasedChannel } from '../../structures/interfaces/TextBasedChannel'
import { Events } from '../../util'

export class ChannelStopTypingAction extends Action {
    handle(data: { id: string; user: string }): unknown {
        const channel = this.client.channels.cache.get(data.id) as TextBasedChannel
        const user = this.client.users.cache.get(data.user)

        if (channel && user) {
            this.client.emit(Events.TYPING_STOP, channel, user)
        }

        return { channel, user }
    }
}
