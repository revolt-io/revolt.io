import { Action } from './Action'
import { Message as RawMessage } from 'revolt-api/types/Channels'
import { TextBasedChannel } from '../../structures/interfaces/TextBasedChannel'
import { Events } from '../../util/Constants'

export class MessageUpdateAction extends Action {
    handle(data: { id: string; channel: string; data: RawMessage }): unknown {
        const channel = this.client.channels.cache.get(data.channel) as TextBasedChannel
        const oldMessage = channel?.messages.cache.get(data.id)

        if (oldMessage) {
            const newMessage = oldMessage._update(data.data)

            channel.messages.cache.set(newMessage.id, newMessage)

            this.client.emit(Events.MESSAGE_UPDATE, oldMessage, newMessage)

            return { newMessage, oldMessage }
        }

        return { oldMessage }
    }
}
