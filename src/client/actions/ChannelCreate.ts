import { Channel as RawChannel } from 'revolt-api/types/Channels'
import { Events } from '../../util/Constants'
import { Action } from './Action'

export class ChannelCreateAction extends Action {
    async handle(data: RawChannel): Promise<unknown> {
        const channel = this.getChannel(data)

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
