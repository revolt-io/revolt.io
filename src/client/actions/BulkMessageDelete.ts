import { Action } from './Action.ts';
import { Events } from '../../util/Constants.ts';

export class BulkMessageDeleteAction extends Action {
  handle(data: { ids: string[] }) {
    // TODO: Get cached messages
    this.client.emit(Events.MESSAGE_DELETE_BULK, data.ids);
  }
}
