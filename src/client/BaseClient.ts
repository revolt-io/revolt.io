/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'events'
import { Client } from '../client/index'
import { REST, Endpoints } from '../rest/index'
import type { Channel, DMChannel, GroupChannel, Role, ServerMember, TextChannel, User, Server, Message } from '../structures/index'
import { DEFAULT_CLIENT_OPTIONS, Events } from '../util/Constants'

export interface ClientEvents {
    message: [Message]
    messageDelete: [Message]
    messageUpdate: [Message, Message]
    ready: [Client]
    serverCreate: [Server]
    serverDelete: [Server]
    serverUpdate: [Server, Server]
    debug: [string]
    error: [unknown]
    raw: [unknown]
    userUpdate: [User, User]
    serverMemberJoin: [ServerMember]
    channelUpdate: [Channel, Channel]
    serverMemberLeave: [ServerMember]
    serverMemberUpdate: [ServerMember, ServerMember]
    roleDelete: [Role]
    typingStart: [TextChannel | DMChannel | GroupChannel, User]
    typingStop: [TextChannel | DMChannel | GroupChannel, User]
    groupJoin: [GroupChannel, User]
    groupLeave: [GroupChannel, User]
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

export interface BaseClientOptions {
    rest: {
        url: string
        retries: number
        timeout: number
    }
    endpoints: {
        cdn: string
        invite: string
        api: string
    }
    ws: {
        heartbeat: number
    }
}

type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>
      }
    : T

export function isObject(item: unknown) {
    return item && typeof item === 'object' && !Array.isArray(item)
}

export abstract class BaseClient extends EventEmitter {
    readonly api: REST
    readonly endpoints: Endpoints
    #token: string | null = null
    bot = true
    options = { ...DEFAULT_CLIENT_OPTIONS }

    constructor(opts: DeepPartial<BaseClientOptions> = {}) {
        super()

        for (const key in opts) {
            Object.assign(this.options[key as keyof BaseClientOptions], opts[key as keyof BaseClientOptions])
        }

        this.api = new REST(this.options.rest)
        this.endpoints = new Endpoints(this.options.endpoints)
        this.api.debug = (msg: string) => this.emit(Events.DEBUG, msg)
    }

    set token(token: string | null) {
        this.#token = token
        this.api.setToken(token, this.bot)
    }

    get token() {
        return this.#token
    }
}
