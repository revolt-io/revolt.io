import { Message, MessageManager, MessageOptions } from '../..'
import { ServerChannel } from '../ServerChannel'
import { TextBasedChannel } from './TextBasedChannel'

export class ServerTextBasedChannel extends ServerChannel implements TextBasedChannel {
    messages = new MessageManager(this)
    send(options: MessageOptions | string): Promise<Message> {
        return this.messages.send(options)
    }
}
