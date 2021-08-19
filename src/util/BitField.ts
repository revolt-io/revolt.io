import { RangeError } from '../errors'

const DEFAULT_BIT = 0

export type BitFieldResolvable = BitField | number | string | BitFieldResolvable[]

export class BitField {
    static FLAGS: Record<string, number> = {}
    bitfield = 0
    constructor(bits: BitFieldResolvable = DEFAULT_BIT) {
        this.bitfield = this.self.resolve(bits)
    }

    get self(): {
        FLAGS: Record<string, number>
        resolve(bit: BitFieldResolvable): number
        new (bits?: BitFieldResolvable): BitField
    } {
        return this.constructor as unknown as {
            FLAGS: Record<string, number>
            resolve(bit: BitFieldResolvable): number
            new (bits?: BitFieldResolvable): BitField
        }
    }

    any(bit: BitFieldResolvable): boolean {
        bit = this.self.resolve(bit)
        return (this.bitfield & bit) !== DEFAULT_BIT
    }

    has(bit: BitFieldResolvable): boolean {
        bit = this.self.resolve(bit)
        return (this.bitfield & bit) === bit
    }

    toArray(): string[] {
        return Object.keys(this.self.FLAGS).filter(bit => this.has(bit))
    }

    add(...bits: BitFieldResolvable[]): this {
        let total = 0

        for (const bit of bits) {
            total |= this.self.resolve(bit)
        }

        if (Object.isFrozen(this)) return new this.self(this.bitfield | total) as this

        this.bitfield |= total

        return this
    }

    remove(...bits: BitFieldResolvable[]): this {
        let total = 0

        for (const bit of bits) {
            total |= this.self.resolve(bit)
        }

        if (Object.isFrozen(this)) return new this.self(this.bitfield & ~total) as this

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
        for (const [flag, bit] of Object.entries(this.self.FLAGS)) serialized[flag] = this.has(bit)
        return serialized
    }

    *[Symbol.iterator](): Iterable<string> {
        yield* this.toArray()
    }

    static resolve(bit: BitFieldResolvable): number {
        if (bit instanceof BitField) return bit.bitfield
        if (typeof bit === 'number' && bit >= DEFAULT_BIT) return bit
        if (Array.isArray(bit)) return bit.map(p => this.resolve(p)).reduce((prev, p) => prev | p, DEFAULT_BIT)
        if (typeof this.FLAGS[bit] !== 'undefined') return this.FLAGS[bit]
        throw new RangeError('BITFIELD_INVALID', bit)
    }
}
