import { Action } from './Action'
import { TextBasedChannel } from '../../structures/interfaces/TextBasedChannel'
import { Events } from '../../util/Constants'

export class MessageDeleteAction extends Action {
    handle(data: { id: string; channel: string }): unknown {
        const channel = this.client.channels.cache.get(data.channel) as TextBasedChannel

        if (channel) {
            const message = channel.messages.cache.get(data.id)

            if (message) {
                message.deleted = true

                channel.messages._remove(message.id)

                this.client.emit(Events.MESSAGE_DELETE, message)
            }

            return { message }
        }

        return {}
    }
}
