import type { Message as APIMessage } from 'https://deno.land/x/revolt_api@0.4.0/types.ts';
import { Action } from './Action.ts';
import { Events, SYSTEM_USER_ID } from '../../util/Constants.ts';

export class MessageAction extends Action {
  async handle(data: APIMessage): Promise<unknown> {
    const channel = this.client.channels.cache.get(data.channel);

    if (channel?.isText()) {
      const message = channel.messages._add(data);

      if (data.author !== SYSTEM_USER_ID) {
        await this.client.users.fetch(data.author, { force: false });
      }

      this.client.emit(Events.MESSAGE, message);

      return { message };
    }

    return {};
  }
}
