import type { Message as APIMessage } from 'https://deno.land/x/revolt_api@0.4.0/types.ts'
import { Action } from './Action.ts'
import { Events } from '../../util/Constants.ts'

export class MessageUpdateAction extends Action {
    handle(data: { id: string; channel: string; data: APIMessage }): unknown {
        const channel = this.client.channels.cache.get(data.channel)

        if (!channel?.isText()) return

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
