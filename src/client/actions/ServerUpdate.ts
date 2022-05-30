import type { API } from '../../../deps.ts';
import { Action } from './Action.ts';
import { Events } from '../../util/Constants.ts';

export class ServerUpdateAction extends Action {
  handle(data: { id: string; data: API.Server }): unknown {
    const oldServer = this.client.servers.cache.get(data.id);

    if (oldServer) {
      const newServer = oldServer._update(data.data);

      this.client.servers.cache.set(newServer.id, newServer);

      this.client.emit(Events.SERVER_UPDATE, oldServer, newServer);

      return { newServer, oldServer };
    }

    return { oldServer };
  }
}
