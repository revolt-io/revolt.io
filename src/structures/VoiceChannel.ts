import { VoiceChannel as RawVoiceChannel } from 'revolt-api/types/Channels'
import { ServerChannel } from '.'
import { Client } from '..'
import { ChannelTypes } from '../util'

export class VoiceChannel extends ServerChannel {
    readonly type = ChannelTypes.VOICE
    constructor(client: Client, raw: RawVoiceChannel) {
        super(client, raw)
    }

    async ack(): Promise<void> {
        throw new TypeError('Cannot ack voice channel')
    }
}
