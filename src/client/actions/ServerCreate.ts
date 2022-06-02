import { Action, Events, API } from './Action.ts'

export class ServerCreateAction extends Action {
  async handle(data: API.Server): Promise<void> {
    const server = this.client.servers._add(data)

    if (this.client.options.fetchMembers) {
      await server.members.fetch()
    }

    this.client.emit(Events.SERVER_CREATE, server)
  }
}
