import type { ClientOptions } from '../client/BaseClient'

export enum Events {
    DEBUG = 'debug',
    ERROR = 'error',
    RAW = 'raw',
    MESSAGE = 'message',
    READY = 'ready',
    CHANNEL_CREATE = 'channelCreate',
    CHANNEL_DELETE = 'channelDelete',
    SERVER_DELETE = 'serverDelete',
    SERVER_UPDATE = 'serverUpdate',
    SERVER_CREATE = 'serverCreate',
    MESSAGE_DELETE = 'messageDelete',
    MESSAGE_UPDATE = 'messageUpdate',
    USER_UPDATE = 'userUpdate',
    SERVER_MEMBER_JOIN = 'serverMemberJoin',
    CHANNEL_UPDATE = 'channelUpdate',
    SERVER_MEMBER_LEAVE = 'serverMemberLeave',
    SERVER_MEMBER_UPDATE = 'serverMemberUpdate',
    ROLE_CREATE = 'roleCreate',
    ROLE_DELETE = 'roleDelete'
}

export enum WSEvents {
    AUTHENTICATE = 'Authenticate',
    AUTHENTICATED = 'Authenticated',
    BEGIN_TYPING = 'BeginTyping',
    CHANNEL_ACK = 'ChannelAck',
    CHANNEL_CREATE = 'ChannelCreate',
    CHANNEL_DELETE = 'ChannelDelete',
    CHANNEL_GROUP_JOIN = 'ChannelGroupJoin',
    CHANNEL_GROUP_LEAVE = 'ChannelGroupLeave',
    CHANNEL_START_TYPING = 'ChannelStartTyping',
    CHANNEL_STOP_TYPING = 'ChannelStopTyping',
    CHANNEL_UPDATE = 'ChannelUpdate',
    END_TYPING = 'EndTyping',
    ERROR = 'Error',
    MESSAGE = 'Message',
    MESSAGE_DELETE = 'MessageDelete',
    MESSAGE_UPDATE = 'MessageUpdate',
    READY = 'Ready',
    SERVER_DELETE = 'ServerDelete',
    SERVER_MEMBER_JOIN = 'ServerMemberJoin',
    SERVER_MEMBER_LEAVE = 'ServerMemberLeave',
    SERVER_MEMBER_UPDATE = 'ServerMemberUpdate',
    SERVER_ROLE_DELETE = 'ServerRoleDelete',
    SERVER_ROLE_UPDATE = 'ServerRoleUpdate',
    SERVER_UPDATE = 'ServerUpdate',
    USER_RELATIONSHIP = 'UserRelationship',
    USER_UPDATE = 'UserUpdate'
}

export enum Presence {
    Online = 'online',
    Idle = 'idle',
    Busy = 'dnd',
    Invisible = 'offline'
}

export enum ChannelTypes {
    DM = 'DM',
    GROUP = 'GROUP',
    TEXT = 'TEXT',
    VOICE = 'VOICE',
    NOTES = 'NOTES'
}

export enum MessageTypes {
    TEXT = 'TEXT',
    USER_ADDED = 'USER_ADDED',
    USER_REMOVE = 'USER_REMOVE',
    USER_LEFT = 'USER_LEFT',
    USER_JOINED = 'USER_JOINED',
    USER_KICKED = 'USER_KICKED',
    USER_BANNED = 'USER_BANNED',
    CHANNEL_DESCRIPTION_CHANGED = 'CHANNEL_DESCRIPTION_CHANGED',
    CHANNEL_ICON_CHANGED = 'CHANNEL_ICON_CHANGED',
    CHANNEL_RENAMED = 'CHANNEL_RENAMED'
}

export const DEFUALT_OPTIONS: ClientOptions = {
    http: {
        api: 'https://api.revolt.chat',
        cdn: 'https://autumn.revolt.chat',
        invite: 'https://app.revolt.chat',
        timeout: 15_000,
        retries: 3,
        offset: 50
    },
    ws: {
        heartbeat: 3_000
    }
} as const

export const SYSTEM_USER_ID = '0'.repeat(26)

export const PermissionsFlags = {
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
