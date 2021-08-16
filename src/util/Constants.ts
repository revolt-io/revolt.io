import { RESTOptions } from '../rest/REST'

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
    CHANNEL_UPDATE = 'channelUpdate'
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
    SAVED = 'SAVED'
}

export enum MessageTypes {
    TEXT = 'TEXT',
    USER_ADDED = 'USER_ADDED',
    USER_REMOVED = 'USER_REMOVED',
    USER_LEFT = 'USER_LEFT',
    USER_JOINED = 'USER_JOINED',
    USER_KICKED = 'USER_KICKED',
    USER_BANNED = 'USER_BANNED',
    CHANNEL_DESCRIPTION_CHANGED = 'CHANNEL_DESCRIPTION_CHANGED',
    CHANNEL_ICON_CHANGED = 'CHANNEL_ICON_CHANGED',
    CHANNEL_RENAMED = 'CHANNEL_RENAMED'
}

export const DEFUALT_OPTIONS = {
    api: 'https://api.revolt.chat',
    retryLimit: 4,
    restRequestTimeout: 15000
} as const

export const DEFUALT_REST_OPTIONS: Required<RESTOptions> = {
    api: 'https://api.revolt.chat',
    cdn: '',
    offset: 50,
    retries: 3,
    timeout: 15_000
}

export const SYSTEM_USER_ID = '0'.repeat(26)
