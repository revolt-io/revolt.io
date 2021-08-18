import { Messages } from './Messages'

const createCustomError = (Base: ErrorConstructor) => {
    return class RevoltError<K extends keyof typeof Messages = keyof typeof Messages> extends Base {
        constructor(key: K, ...args: Parameters<typeof Messages[K]>) {
            super(Messages[key].call(null, ...args))
            Base.captureStackTrace(this, RevoltError)
        }
    }
}

export const Error = createCustomError(globalThis.Error)
export const TypeError = createCustomError(globalThis.TypeError)
export const RangeError = createCustomError(globalThis.RangeError)
