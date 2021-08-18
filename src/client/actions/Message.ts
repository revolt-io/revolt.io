import { Message as RawMessage } from 'revolt-api/types/Channels'
import { Action } from './Action'
import { TextBasedChannel } from '../../structures/interfaces/TextBasedChannel'
import { Events } from '../../util/Constants'

export class MessageAction extends Action {
    handle(data: RawMessage): unknown {
        const channel = this.client.channels.cache.get(data.channel) as TextBasedChannel

        if (channel) {
            const message = channel.messages._add(data)

            this.client.emit(Events.MESSAGE, message)

            return { message }
        }

        return {}
    }
}
