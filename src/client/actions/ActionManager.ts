import * as Actions from './mod.ts';
import { Action as BaseAction } from './Action.ts';
import type { Client } from '../Client.ts';

export class ActionManager {
  #actions = new Map<string, BaseAction>();

  constructor(protected readonly client: Client) {
    for (const Action of Object.values(Actions)) this.register(Action);
  }

  register(Action: new (client: Client) => BaseAction): void {
    this.#actions.set(
      Action.name.replace(/Action$/, ''),
      new Action(this.client),
    );
  }

  get(name: string): BaseAction | null {
    return this.#actions.get(name) ?? null;
  }
}
