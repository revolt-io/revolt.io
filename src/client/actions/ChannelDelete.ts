import { Action } from './Action.ts';
import { Events } from '../../util/Constants.ts';

export class ChannelDeleteAction extends Action {
  handle(data: { id: string }): unknown {
    const channel = this.client.channels.cache.get(data.id);

    if (channel) {
      if (channel.inServer()) {
        channel.server?.channels.cache.delete(channel.id);
      }
      this.client.emit(Events.CHANNEL_DELETE, channel);
    }

    return { channel };
  }
}
