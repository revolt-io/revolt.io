export class Permissions {
    static readonly FLAGS = {
        USER: {
            ACCESS: 1,
            VIEW_PROFILE: 2,
            SEND_MESSAGES: 4,
            INVITE: 8
        },
        CHANNEL: {
            VIEW_CHANNEL: 1,
            SEND_MESSAGE: 2,
            MANAGE_MESSAGE: 4,
            MANAGE_CHANNEL: 8,
            VOICE_CALL: 16,
            INVITE_OTHERS: 32,
            EMBED_LINKS: 64,
            UPLOAD_FILES: 128
        },
        SERVER: {
            VIEW_SERVER: 1,
            MANAGE_ROLES: 2,
            MANAGE_CHANNELS: 4,
            MANAGE_SERVER: 8,
            KICK_MEMBERS: 16,
            BAN_MEMBERS: 32,
            CHANGE_NICKNAME: 4096,
            MANAGE_NICKNAMES: 8192,
            CHANGE_AVATAR: 32768,
            REMOVE_AVATARS: 32768
        }
    }
    static readonly DEFAULT_PERMISSION_DM =
        Permissions.FLAGS.CHANNEL.VIEW_CHANNEL +
        Permissions.FLAGS.CHANNEL.SEND_MESSAGE +
        Permissions.FLAGS.CHANNEL.MANAGE_CHANNEL +
        Permissions.FLAGS.CHANNEL.VOICE_CALL +
        Permissions.FLAGS.CHANNEL.EMBED_LINKS +
        Permissions.FLAGS.CHANNEL.UPLOAD_FILES +
        Permissions.FLAGS.CHANNEL.INVITE_OTHERS
}
