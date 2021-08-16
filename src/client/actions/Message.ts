import { Message as RawMessage } from 'revolt-api/types/Channels'
import { TextChannel } from '../../structures'
import { Events } from '../../util/Constants'
import { Action } from './Action'

export class MessageAction extends Action {
    handle(data: RawMessage): unknown {
        const channel = this.client.channels.cache.get(data.channel)

        if (channel) {
            const message = this.getMessage(data, channel as TextChannel)

            this.client.emit(Events.MESSAGE, message)

            return { message }
        }

        return {}
    }
}
