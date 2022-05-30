// deno-lint-ignore-file no-explicit-any
import { EventEmitter, REST, RESTOptions } from '../../deps.ts';
import { Client } from './mod.ts';
import type {
  Channel,
  DMChannel,
  GroupChannel,
  Message,
  Role,
  Server,
  ServerMember,
  TextChannel,
  User,
} from '../structures/mod.ts';
import { DEFAULT_CLIENT_OPTIONS, Events } from '../util/Constants.ts';

export interface ClientEvents {
  channelUpdate: [Channel, Channel];
  debug: [string];
  error: [unknown];
  groupJoin: [GroupChannel, User];
  groupLeave: [GroupChannel, User];
  message: [Message];
  messageDelete: [Message];
  messageDeleteBulk: [string[]];
  messageUpdate: [Message, Message];
  raw: [unknown];
  ready: [Client];
  roleDelete: [Role];
  roleUpdate: [Role, Role];
  serverCreate: [Server];
  serverDelete: [Server];
  serverMemberJoin: [ServerMember];
  serverMemberLeave: [ServerMember];
  serverMemberUpdate: [ServerMember, ServerMember];
  serverUpdate: [Server, Server];
  typingStart: [TextChannel | DMChannel | GroupChannel, User];
  typingStop: [TextChannel | DMChannel | GroupChannel, User];
  userUpdate: [User, User];
}

export declare interface BaseClient {
  on<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => Awaited<void>,
  ): this;
  on<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => Awaited<void>,
  ): this;
  once<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => Awaited<void>,
  ): this;
  once<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => Awaited<void>,
  ): this;
  emit<K extends keyof ClientEvents>(
    event: K,
    ...args: ClientEvents[K]
  ): boolean;
  emit<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    ...args: unknown[]
  ): boolean;
  off<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => Awaited<void>,
  ): this;
  off<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => Awaited<void>,
  ): this;
  removeAllListeners<K extends keyof ClientEvents>(event?: K): this;
  removeAllListeners<S extends string | symbol>(
    event?: Exclude<S, keyof ClientEvents>,
  ): this;
}

export interface BaseClientOptions {
  rest: RESTOptions;
  ws: {
    heartbeat: number;
  };
}

// deno-lint-ignore ban-types
type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
}
  : T;

export function isObject(item: unknown) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export abstract class BaseClient extends EventEmitter {
  readonly api: REST;
  #token: string | null = null;
  bot = true;
  options = { ...DEFAULT_CLIENT_OPTIONS };

  constructor(opts: DeepPartial<BaseClientOptions> = {}) {
    super();

    for (const key in opts) {
      Object.assign(
        this.options[key as keyof BaseClientOptions],
        opts[key as keyof BaseClientOptions],
      );
    }

    this.api = new REST(this.options.rest);
    this.api.debug = (msg: string) => this.emit(Events.DEBUG, `[HTTP]: ${msg}`);
  }

  debug(msg: unknown): void {
    this.emit(Events.DEBUG, `[MAIN]: ${msg}`);
  }

  set token(token: string | null) {
    this.#token = token;
    this.api.setToken(token, this.bot);
  }

  get token() {
    return this.#token;
  }
}
