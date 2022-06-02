import { Action, Events, API } from './Action.ts';

export class ChannelCreateAction extends Action {
  async handle(data: API.Channel): Promise<unknown> {
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
