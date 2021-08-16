/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter from 'events'
import { Session } from 'revolt-api/types/Auth'
import { Client, DEFUALT_OPTIONS, Message, Server } from '..'
import { REST } from '../rest/REST'

export type Awaited<T> = T | Promise<T>

export interface ClientEvents {
    message: [Message]
    messageDelete: [Message]
    ready: [Client]
    serverCreate: [Server]
    serverDelete: [Server]
    debug: [unknown]
    error: [unknown]
    raw: [unknown]
}

export declare interface BaseClient {
    on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this
    on<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => Awaited<void>): this
    once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this
    once<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => Awaited<void>): this
    emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean
    emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: unknown[]): boolean
    off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this
    off<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => Awaited<void>): this
    removeAllListeners<K extends keyof ClientEvents>(event?: K): this
    removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ClientEvents>): this
}

export interface ClientOptions {
    api?: string
}

export class BaseClient extends EventEmitter {
    private readonly rest = new REST(this)
    public session: Session | string | null = null
    public options: ClientOptions

    constructor(options: ClientOptions = {}) {
        super()
        this.options = { ...DEFUALT_OPTIONS, ...options }
    }

    get api(): REST {
        return this.rest
    }

    get headers(): unknown {
        if (typeof this.session === 'string') {
            return {
                'x-bot-token': this.session
            }
        } else {
            return {
                'x-user-id': this.session?.user_id,
                'x-session-token': this.session?.session_token
            }
        }
    }
}
