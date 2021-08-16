import { Events } from '../../util/Constants'
import { Action } from './Action'

export class ChannelDeleteAction extends Action {
    handle(data: { id: string }): unknown {
        const channel = this.client.channels.cache.get(data.id)

        if (channel) {
            channel.deleted = true

            if (channel.inServer()) {
                channel.server?.channels.cache.delete(channel.id)
            }

            this.client.emit(Events.CHANNEL_DELETE, channel)
        }

        return { channel }
    }
}
