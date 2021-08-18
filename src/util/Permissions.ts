import { BitField, BitFieldResolvable } from './BitField'

export class ChannelPermissions extends BitField {
    constructor(bits?: BitFieldResolvable) {
        super(
            {
                VIEW_CHANNEL: 1 << 0,
                SEND_MESSAGE: 1 << 1,
                MANAGE_MESSAGE: 1 << 2,
                MANAGE_CHANNEL: 1 << 3,
                VOICE_CALL: 1 << 4,
                INVITE_OTHERS: 1 << 5,
                EMBED_LINKS: 1 << 6,
                UPLOAD_FILES: 1 << 7
            },
            bits
        )
    }
}

export class UserPermissions extends BitField {
    constructor(bits?: BitFieldResolvable) {
        super(
            {
                ACCESS: 1 << 0,
                VIEW_PROFILE: 1 << 1,
                SEND_MESSAGES: 1 << 2,
                INVITE: 1 << 3
            },
            bits
        )
    }
}

export class ServerPermissions extends BitField {
    constructor(bits?: BitFieldResolvable) {
        super(
            {
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
            },
            bits
        )
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
