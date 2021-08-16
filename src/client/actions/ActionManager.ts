import { Client } from '../Client'
import { Action as BaseAction } from './Action'
import * as Actions from '.'

export class ActionManager {
    #actions: Record<string, BaseAction> = {}

    constructor(public client: Client) {
        for (const Action of Object.values(Actions)) {
            this.register(Action)
        }
    }

    register(Action: new (client: Client) => BaseAction): void {
        this.#actions[Action.name.replace(/Action$/, '')] = new Action(this.client)
    }

    get(name: string): BaseAction | null {
        return this.#actions[name as keyof ActionManager] ?? null
    }
}
