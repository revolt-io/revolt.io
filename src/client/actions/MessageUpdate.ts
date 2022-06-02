import { Action, API, Events } from './Action.ts';

export class MessageUpdateAction extends Action {
  handle(data: { id: string; channel: string; data: API.Message }): void {
    const channel = this.client.channels.cache.get(data.channel);

    if (!channel?.isText()) return;

    const message = channel?.messages.cache.get(data.id);
    const oldMessage = message?._update(data.data);

    if (oldMessage && message && !message.equals(oldMessage)) {
      this.client.emit(Events.MESSAGE_UPDATE, oldMessage, message);
    }
  }
}
