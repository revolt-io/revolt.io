import { Channel as APIChannel } from 'revolt-api'
import { ServerChannel } from './index'
import { Client } from '../index'
import { ChannelTypes } from '../util/index'

type APIVoiceChannel = Extract<APIChannel, { channel_type: 'VoiceChannel' }>

export class VoiceChannel extends ServerChannel {
    readonly type = ChannelTypes.VOICE
    constructor(client: Client, raw: APIVoiceChannel) {
        super(client, raw)
    }

    async ack(): Promise<void> {
        throw new TypeError('Cannot ack voice channel')
    }
}
