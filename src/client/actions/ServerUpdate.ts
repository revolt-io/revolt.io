import type { API } from '../../../deps.ts';
import { Action } from './Action.ts';
import { Events } from '../../util/Constants.ts';

export class ServerUpdateAction extends Action {
  handle(
    data: { id: string; data: API.Server; clear: API.FieldsServer[] },
  ): void {
    const server = this.client.servers.cache.get(data.id);
    const oldServer = server?._update(data.data, data.clear);

    if (oldServer && server && !oldServer.equals(server)) {
      this.client.emit(Events.SERVER_UPDATE, oldServer, server);
    }
  }
}
