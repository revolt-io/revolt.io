import type { Channel as APIChannel } from 'revolt-api-types';
import { Action } from './Action.ts';
import { Events } from '../../util/Constants.ts';

export class ChannelCreateAction extends Action {
  async handle(data: APIChannel): Promise<unknown> {
    const channel = this.client.channels._add(data);

    if (channel) {
      if (channel.inServer()) {
        const server = channel.server ??
          (await this.client.servers.fetch(channel.serverId));
        server.channels.cache.set(channel.id, channel);
      }
      this.client.emit(Events.CHANNEL_CREATE, channel);
    }

    return { channel };
  }
}
