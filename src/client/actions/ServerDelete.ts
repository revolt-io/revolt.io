import type { Server as APIServer } from 'https://deno.land/x/revolt_api@0.4.0/types.ts';
import { Action } from './Action.ts';
import { Events } from '../../util/Constants.ts';

export class ServerDeleteAction extends Action {
  handle(data: APIServer): unknown {
    const server = this.client.servers.cache.get(data._id);

    if (server) {
      this.client.servers._remove(server.id);
      this.client.emit(Events.SERVER_DELETE, server);
    }

    return { server };
  }
}
