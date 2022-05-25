import { BitField } from './BitField'

export type BadgeString = keyof typeof FLAGS
export type BadgesResolvable = number | BadgeString | BadgesResolvable[]

export declare interface Badges {
    serialize(): Record<BadgeString, boolean>
    any(bit: BadgesResolvable): boolean
    add(...bits: BadgesResolvable[]): this
    remove(...bits: BadgesResolvable[]): this
    has(bit: BadgesResolvable): boolean
}

const FLAGS = {
    DEVELOPER: 1 << 0,
    TRANSLATOR: 1 << 1,
    SUPPORTER: 1 << 2,
    RESPONSIBLE_DISCLOSURE: 1 << 3,
    REVOLT_TEAM: 1 << 4,
    EARLY_ADOPTER: 1 << 8
} as const

export class Badges extends BitField {
    static FLAGS: typeof FLAGS
    constructor(bits?: BadgesResolvable) {
        super(bits)
    }
    static resolve(bit: BadgesResolvable): number {
        return super.resolve(bit)
    }
}

Badges.FLAGS = FLAGS
