/* eslint-disable @typescript-eslint/no-explicit-any */
import { RangeError } from '../errors'

const DEFAULT_BIT = 0

export type BitFieldResolvable = BitField | number | string | string[] | number[]

export class BitField {
    bitfield = 0
    constructor(public readonly FLAGS: Record<string, number>, bits: BitFieldResolvable = DEFAULT_BIT) {
        this.bitfield = BitField.resolve(FLAGS, bits)
    }

    any(bit: BitFieldResolvable): boolean {
        return (this.bitfield & BitField.resolve(this.FLAGS, bit)) !== DEFAULT_BIT
    }

    has(bit: BitFieldResolvable): boolean {
        bit = BitField.resolve(this.FLAGS, bit)
        return (this.bitfield & bit) === bit
    }

    toArray(): string[] {
        return Object.keys(this.FLAGS).filter(bit => this.has(bit))
    }

    add(...bits: BitFieldResolvable[]): BitField {
        let total = 0

        for (const bit of bits) {
            total |= BitField.resolve(this.FLAGS, bit)
        }

        if (Object.isFrozen(this)) return new (this.constructor as any)(this.bitfield | total)

        this.bitfield |= total

        return this
    }

    remove(...bits: BitFieldResolvable[]): BitField {
        let total = 0

        for (const bit of bits) {
            total |= BitField.resolve(this.FLAGS, bit)
        }

        if (Object.isFrozen(this)) return new (this.constructor as any)(this.bitfield & ~total)

        this.bitfield &= ~total

        return this
    }

    freeze(): Readonly<this> {
        return Object.freeze(this)
    }

    valueOf(): number {
        return this.bitfield
    }

    serialize(): Record<string, boolean> {
        const serialized: Record<string, boolean> = {}
        for (const [flag, bit] of Object.entries(this.FLAGS)) serialized[flag] = this.has(bit)
        return serialized
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    *[Symbol.iterator](): Generator<string, any, undefined> {
        yield* this.toArray()
    }

    static resolve(FLAGS: Record<string, number>, bit: BitFieldResolvable): number {
        if (bit instanceof BitField) return bit.bitfield
        if (typeof bit === 'number' && bit >= DEFAULT_BIT) return bit
        if (Array.isArray(bit)) return bit.map(p => this.resolve(FLAGS, p)).reduce((prev, p) => prev | p, DEFAULT_BIT)
        if (typeof FLAGS[bit] !== 'undefined') return FLAGS[bit]
        throw new RangeError('BITFIELD_INVALID', bit)
    }
}
