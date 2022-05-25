import { randomBytes } from 'node:crypto'

export class UUID extends null {
    static readonly ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
    static readonly ENCODING_LENGTH = UUID.ENCODING.length
    static readonly RANDOM_LENGTH = 16
    static readonly TIME_LENGTH = 10
    static readonly TIME_MAX = Math.pow(2, 48) - 1
    static get PROG(): number {
        return randomBytes(1).readUInt8() / 0xff
    }

    private static time(now = Date.now()): string {
        let mod: number,
            result = ''

        for (let i = this.TIME_LENGTH; i > 0; i--) {
            mod = now % this.ENCODING_LENGTH
            result = this.ENCODING.charAt(mod) + result
            now = (now - mod) / this.ENCODING_LENGTH
        }

        return result
    }

    private static hash(): string {
        let result = ''

        for (let i = this.RANDOM_LENGTH; i > 0; i--) {
            let random = Math.floor(this.PROG * this.ENCODING_LENGTH)

            if (random === this.ENCODING_LENGTH) {
                random = this.ENCODING_LENGTH - 1
            }

            result = this.ENCODING.charAt(random) + result
        }

        return result
    }

    static generate(timestamp = Date.now()): string {
        return this.time(timestamp) + this.hash()
    }

    static timestampOf(id: string): Date {
        const timestamp = id
            .slice(0, this.TIME_LENGTH)
            .split('')
            .reverse()
            .reduce((carry, char, index) => {
                const encodingIndex = this.ENCODING.indexOf(char)

                if (encodingIndex === -1) {
                    throw new Error('invalid character found: ' + char)
                }

                return (carry += encodingIndex * Math.pow(this.ENCODING_LENGTH, index))
            }, 0)

        return new Date(timestamp)
    }
}
