import { Client } from '../client/Client'

export abstract class Base {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(public client: Client, _data: unknown) {}
}
