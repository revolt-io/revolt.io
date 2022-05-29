import type { Member as APIMember } from 'https://deno.land/x/revolt_api@0.4.0/types.ts';
import { Action } from './Action.ts';
import { Events } from '../../util/Constants.ts';

export class ServerMemberUpdateAction extends Action {
  handle(data: { id: string; data: APIMember }): unknown {
    const server = this.client.servers.cache.get(data.id);
    const oldMember = server?.members.cache.get(data.data?._id?.user);

    if (server && oldMember) {
      const newMember = oldMember._update(data.data);

      server.members.cache.set(newMember.id, newMember);

      this.client.emit(Events.SERVER_MEMBER_UPDATE, oldMember, newMember);

      return { newMember, oldMember };
    }

    return { oldMember };
  }
}
