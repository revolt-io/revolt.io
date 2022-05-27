import type { Client } from '../Client.ts'

export abstract class Action {
    constructor(public client: Client) {}
    abstract handle(data: unknown): unknown
}
