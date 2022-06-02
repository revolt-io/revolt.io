import { Action, API, Events } from './Action.ts';

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
