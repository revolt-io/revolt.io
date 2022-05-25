import { UUID } from './UUID'
import { BaseClientOptions } from '../client/BaseClient'

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
    ROLE_DELETE = 'roleDelete',
    TYPING_START = 'typingStart',
    TYPING_STOP = 'typingStop',
    GROUP_JOIN = 'groupJoin',
    GROUP_LEAVE = 'groupLeave'
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
    PING = 'Ping',
    PONG = 'Pong',
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
    ONLINE = 'ONLINE',
    IDLE = 'IDLE',
    BUSY = 'DND',
    INVISIBLE = 'OFFLINE'
}

export enum ChannelTypes {
    DM = 'DM',
    GROUP = 'GROUP',
    TEXT = 'TEXT',
    VOICE = 'VOICE',
    NOTES = 'NOTES'
}

export const DEFAULT_CLIENT_OPTIONS: BaseClientOptions = {
    rest: {
        url: 'https://api.revolt.chat',
        timeout: 15_000,
        retries: 3
    },
    endpoints: {
        api: 'https://api.revolt.chat',
        cdn: 'https://autumn.revolt.chat',
        invite: 'https://app.revolt.chat'
    },
    ws: {
        heartbeat: 3_000
    }
} as const

export const SYSTEM_USER_ID = '0'.repeat(UUID.TIME_LENGTH + UUID.RANDOM_LENGTH)
