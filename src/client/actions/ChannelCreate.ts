import { Channel as RawChannel } from 'revolt-api/types/Channels'
import { Action } from './Action'
import { Events } from '../../util/Constants'

export class ChannelCreateAction extends Action {
    async handle(data: RawChannel): Promise<unknown> {
        const channel = this.client.channels._add(data)

        if (channel) {
            if (channel.inServer()) {
                const server = channel.server ?? (await this.client.servers.fetch(channel.serverId))
                server.channels.cache.set(channel.id, channel)
            }
            this.client.emit(Events.CHANNEL_CREATE, channel)
        }

        return { channel }
    }
}
