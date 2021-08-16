import { Message, MessageManager, MessageOptions } from '../..'
import { Channel } from '../Channel'

export class TextBasedChannel extends Channel {
    messages = new MessageManager(this)
    send(options: MessageOptions | string): Promise<Message> {
        return this.messages.send(options)
    }
}
