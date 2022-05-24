import { Channel as APIChannel } from 'revolt-api'
import { ServerChannel } from '.'
import { Client } from '..'
import { ChannelTypes } from '../util'

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
