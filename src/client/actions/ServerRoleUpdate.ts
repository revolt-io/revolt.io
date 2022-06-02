import { Action, API, Events } from './Action.ts';

export class ServerRoleUpdateAction extends Action {
  handle(
    data: {
      id: string;
      role_id: string;
      data: API.Role & { _id: string };
      clear: API.FieldsRole[];
    },
  ): void {
    const server = this.client.servers.cache.get(data.id);

    if (!server) return;

    const role = server.roles.cache.get(data.role_id);
    const oldRole = role?._update(data.data, data.clear);

    if (role && oldRole && !role.equals(oldRole)) {
      this.client.emit(Events.ROLE_UPDATE, oldRole, role);
    }
  }
}
