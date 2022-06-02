import { Action, API, Events } from './Action.ts';

export class UserUpdateAction extends Action {
  handle(data: { id: string; data: API.User; clear: API.FieldsUser[] }): void {
    const user = data.id === this.client.user!.id
      ? this.client.user
      : this.client.users.cache.get(data.id);
    const oldUser = user?._update(data.data, data.clear);
    if (user && oldUser && !user.equals(oldUser)) {
      this.client.emit(Events.USER_UPDATE, oldUser, user);
    }
  }
}
