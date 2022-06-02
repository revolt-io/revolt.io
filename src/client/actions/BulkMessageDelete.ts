import { Action, Events } from './Action.ts';

export class BulkMessageDeleteAction extends Action {
  handle(data: { ids: string[] }) {
    // TODO: Get cached messages
    this.client.emit(Events.MESSAGE_DELETE_BULK, data.ids);
  }
}
