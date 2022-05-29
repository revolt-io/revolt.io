import { Action } from './Action.ts';
import { Events } from '../../util/Constants.ts';

export class MessageDeleteAction extends Action {
  handle(data: { id: string; channel: string }): unknown {
    const channel = this.client.channels.cache.get(data.channel);

    if (channel?.isText()) {
      const message = channel.messages.cache.get(data.id);

      if (message) {
        channel.messages._remove(message.id);
        this.client.emit(Events.MESSAGE_DELETE, message);
      }

      return { message };
    }

    return {};
  }
}
