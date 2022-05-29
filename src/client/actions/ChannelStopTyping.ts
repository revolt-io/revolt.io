import { Action } from './Action.ts';
import { Events } from '../../util/mod.ts';

export class ChannelStopTypingAction extends Action {
  handle(data: { id: string; user: string }): unknown {
    const channel = this.client.channels.cache.get(data.id);
    const user = this.client.users.cache.get(data.user);

    if (channel?.isText() && user) {
      this.client.emit(Events.TYPING_STOP, channel, user);
    }

    return { channel, user };
  }
}
