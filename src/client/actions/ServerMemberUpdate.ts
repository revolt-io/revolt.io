import type { API } from '../../../deps.ts';
import { Action } from './Action.ts';
import { Events } from '../../util/Constants.ts';

export class ServerMemberUpdateAction extends Action {
  handle(data: { id: string; data: API.Member }): void {
    const server = this.client.servers.cache.get(data.id);
    const member = server?.members.cache.get(data.data?._id?.user);
    const oldMember = member?._update(data.data)

    if (oldMember && member && !member.equals(oldMember)) {
      this.client.emit(Events.SERVER_MEMBER_UPDATE, oldMember, member);
    }
  }
}
