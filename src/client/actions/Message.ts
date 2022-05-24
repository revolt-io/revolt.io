import { Message as APIMessage } from 'revolt-api'
import { Action } from './Action'
import { Events } from '../../util/Constants'

export class MessageAction extends Action {
    handle(data: APIMessage): unknown {
        const channel = this.client.channels.cache.get(data.channel)

        if (channel?.isText()) {
            const message = channel.messages._add(data)

            this.client.emit(Events.MESSAGE, message)

            return { message }
        }

        return {}
    }
}
