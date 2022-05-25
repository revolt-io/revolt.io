import { BitField } from './BitField'

export type ChannelPermissionsString = keyof typeof FLAGS['CHANNEL']
export type UserPermissionsString = keyof typeof FLAGS['USER']
export type ServerPermissionsString = keyof typeof FLAGS['SERVER']
export type ChannelPermissionsResolvable = number | ChannelPermissionsString | ChannelPermissions | ChannelPermissionsResolvable[]
export type UserPermissionsResolvable = number | UserPermissionsString | UserPermissions | UserPermissionsResolvable[]
export type ServerPermissionsResolvable = number | ServerPermissionsString | ServerPermissions | ServerPermissionsResolvable[]

export declare interface ServerPermissions {
    serialize(): Record<ServerPermissionsString, boolean>
    any(bit: ServerPermissionsResolvable): boolean
    add(...bits: ServerPermissionsResolvable[]): this
    remove(...bits: ServerPermissionsResolvable[]): this
    has(bit: ServerPermissionsResolvable): boolean
}

export declare interface ChannelPermissions {
    serialize(): Record<ChannelPermissionsString, boolean>
    any(bit: ChannelPermissionsResolvable): boolean
    add(...bits: ChannelPermissionsResolvable[]): this
    remove(...bits: ChannelPermissionsResolvable[]): this
    has(bit: ChannelPermissionsResolvable): boolean
}

export declare interface UserPermissions {
    serialize(): Record<UserPermissionsString, boolean>
    any(bit: UserPermissionsResolvable): boolean
    add(...bits: UserPermissionsResolvable[]): this
    remove(...bits: UserPermissionsResolvable[]): this
    has(bit: UserPermissionsResolvable): boolean
}

const FLAGS = {
    CHANNEL: {
        VIEW_CHANNEL: 1 << 0,
        SEND_MESSAGE: 1 << 1,
        MANAGE_MESSAGE: 1 << 2,
        MANAGE_CHANNEL: 1 << 3,
        VOICE_CALL: 1 << 4,
        INVITE_OTHERS: 1 << 5,
        EMBED_LINKS: 1 << 6,
        UPLOAD_FILES: 1 << 7
    },
    USER: {
        ACCESS: 1 << 0,
        VIEW_PROFILE: 1 << 1,
        SEND_MESSAGES: 1 << 2,
        INVITE: 1 << 3
    },
    SERVER: {
        VIEW_SERVER: 1 << 0,
        MANAGE_ROLES: 1 << 1,
        MANAGE_CHANNELS: 1 << 2,
        MANAGE_SERVER: 1 << 3,
        KICK_MEMBERS: 1 << 4,
        BAN_MEMBERS: 1 << 5,
        CHANGE_NICKNAME: 1 << 12,
        MANAGE_NICKNAMES: 1 << 13,
        CHANGE_AVATAR: 1 << 14,
        REMOVE_AVATARS: 1 << 15
    }
} as const

export class ChannelPermissions extends BitField {
    static FLAGS: typeof FLAGS['CHANNEL']
    constructor(bits?: ChannelPermissionsResolvable) {
        super(bits)
    }
    static resolve(bit: ChannelPermissionsResolvable): number {
        return super.resolve(bit)
    }
}

ChannelPermissions.FLAGS = FLAGS.CHANNEL

export class UserPermissions extends BitField {
    static FLAGS: typeof FLAGS['USER']
    constructor(bits?: UserPermissionsResolvable) {
        super(bits)
    }
    static resolve(bit: UserPermissionsResolvable): number {
        return super.resolve(bit)
    }
}

UserPermissions.FLAGS = FLAGS.USER

export class ServerPermissions extends BitField {
    static FLAGS: typeof FLAGS['SERVER']
    constructor(bits?: ServerPermissionsResolvable) {
        super(bits)
    }
    static resolve(bit: ServerPermissionsResolvable): number {
        return super.resolve(bit)
    }
}

ServerPermissions.FLAGS = FLAGS.SERVER

export const DEFAULT_PERMISSION_DM = new ChannelPermissions([
    'VIEW_CHANNEL',
    'VIEW_CHANNEL',
    'MANAGE_CHANNEL',
    'VOICE_CALL',
    'EMBED_LINKS',
    'UPLOAD_FILES'
]).freeze()
