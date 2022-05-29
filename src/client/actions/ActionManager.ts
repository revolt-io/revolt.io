import * as Actions from './mod.ts';
import { Action as BaseAction } from './Action.ts';
import { Client } from '../Client.ts';

export class ActionManager {
  private actions: Record<string, BaseAction> = {};

  constructor(public client: Client) {
    for (const Action of Object.values(Actions)) this.register(Action);
  }

  register(Action: new (client: Client) => BaseAction): void {
    this.actions[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }

  get(name: string): BaseAction | null {
    return this.actions[name as keyof ActionManager] ?? null;
  }
}
