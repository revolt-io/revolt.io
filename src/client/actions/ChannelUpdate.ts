import { Channel as RawChannel } from 'revolt-api/types/Channels'
import { Action } from './Action'
import { Events } from '../../util/Constants'

export class ChannelUpdateAction extends Action {
    handle(data: { id: string; data: RawChannel }): unknown {
        const oldChannel = this.client.channels.cache.get(data.id)

        if (oldChannel) {
            const newChannel = oldChannel._update(data.data)

            this.client.channels.cache.set(newChannel.id, newChannel)
            this.client.emit(Events.CHANNEL_UPDATE, oldChannel, newChannel)

            return { newChannel, oldChannel }
        }

        return { oldChannel }
    }
}
