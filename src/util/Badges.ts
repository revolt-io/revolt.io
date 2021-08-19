import { BitField } from './BitField'
import { BadgesFlags } from './Constants'

export type BadgesResolvable = number | keyof typeof BadgesFlags | BadgesResolvable[]

export declare interface Badges {
    serialize(): Record<keyof typeof BadgesFlags, boolean>
    any(bit: BadgesResolvable): boolean
    add(...bits: BadgesResolvable[]): this
    remove(...bits: BadgesResolvable[]): this
    has(bit: BadgesResolvable): boolean
}

export class Badges extends BitField {
    static readonly FLAGS = BadgesFlags
    constructor(bits?: BadgesResolvable) {
        super(bits)
    }
    static resolve(bit: BadgesResolvable): number {
        return super.resolve(bit)
    }
}
