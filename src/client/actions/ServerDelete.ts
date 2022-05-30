import type { API } from '../../../deps.ts';
import { Action } from './Action.ts';
import { Events } from '../../util/Constants.ts';

export class ServerDeleteAction extends Action {
  handle(data: API.Server): unknown {
    const server = this.client.servers.cache.get(data._id);

    if (server) {
      this.client.servers._remove(server.id);
      this.client.emit(Events.SERVER_DELETE, server);
    }

    return { server };
  }
}
