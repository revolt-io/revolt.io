import { BitField } from './BitField'
import { PermissionsFlags } from './Constants'

export type ChannelPermissionsResolvable<T = keyof typeof PermissionsFlags.CHANNEL> = number | T | ChannelPermissions | ChannelPermissionsResolvable[]
export type UserPermissionsResolvable<T = keyof typeof PermissionsFlags.USER> = number | T | UserPermissions | UserPermissionsResolvable[]
export type ServerPermissionsResolvable<T = keyof typeof PermissionsFlags.SERVER> = number | T | ServerPermissions | ServerPermissionsResolvable[]

export declare interface ServerPermissions {
    serialize(): Record<keyof typeof PermissionsFlags.SERVER, boolean>
    any(bit: ServerPermissionsResolvable): boolean
    add(...bits: ServerPermissionsResolvable[]): this
    remove(...bits: ServerPermissionsResolvable[]): this
    has(bit: ServerPermissionsResolvable): boolean
}

export declare interface ChannelPermissions {
    serialize(): Record<keyof typeof PermissionsFlags.CHANNEL, boolean>
    any(bit: ChannelPermissionsResolvable): boolean
    add(...bits: ChannelPermissionsResolvable[]): this
    remove(...bits: ChannelPermissionsResolvable[]): this
    has(bit: ChannelPermissionsResolvable): boolean
}

export declare interface UserPermissions {
    serialize(): Record<keyof typeof PermissionsFlags.USER, boolean>
    any(bit: UserPermissionsResolvable): boolean
    add(...bits: UserPermissionsResolvable[]): this
    remove(...bits: UserPermissionsResolvable[]): this
    has(bit: UserPermissionsResolvable): boolean
}

export class ChannelPermissions extends BitField {
    static readonly FLAGS = PermissionsFlags.CHANNEL
    constructor(bits?: ChannelPermissionsResolvable) {
        super(bits)
    }
    static resolve(bit: ChannelPermissionsResolvable): number {
        return super.resolve(bit)
    }
}

export class UserPermissions extends BitField {
    static readonly FLAGS = PermissionsFlags.USER
    constructor(bits?: UserPermissionsResolvable) {
        super(bits)
    }
    static resolve(bit: UserPermissionsResolvable): number {
        return super.resolve(bit)
    }
}

export class ServerPermissions extends BitField {
    static readonly FLAGS = PermissionsFlags.SERVER
    constructor(bits?: ServerPermissionsResolvable) {
        super(bits)
    }
    static resolve(bit: ServerPermissionsResolvable): number {
        return super.resolve(bit)
    }
}

export const DEFAULT_PERMISSION_DM = new ChannelPermissions([
    'VIEW_CHANNEL',
    'VIEW_CHANNEL',
    'MANAGE_CHANNEL',
    'VOICE_CALL',
    'EMBED_LINKS',
    'UPLOAD_FILES'
]).freeze()
