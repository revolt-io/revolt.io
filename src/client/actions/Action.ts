import type { Client } from '../Client.ts';

export abstract class Action {
  constructor(protected readonly client: Client) {}
  abstract handle(data: unknown): Awaited<unknown | void>;
}
