import { Action, Events, API } from './Action.ts';

export class ChannelUpdateAction extends Action {
  handle(
    data: { id: string; data: API.Channel; clear: API.FieldsChannel },
  ): void {
    const channel = this.client.channels.cache.get(data.id);
    const oldChannel = channel?._update(data.data);
    if (channel && oldChannel && !channel.equals(oldChannel)) {
      this.client.emit(Events.CHANNEL_UPDATE, oldChannel, channel);
    }
  }
}
