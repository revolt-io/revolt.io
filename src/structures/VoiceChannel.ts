import { Client } from '..'
import { VoiceChannel as RawVoiceChannel } from 'revolt-api/types/Channels'
import { ServerChannel } from './ServerChannel'
import { ChannelTypes } from '../util/Constants'

export class VoiceChannel extends ServerChannel {
    readonly type = ChannelTypes.VOICE
    constructor(client: Client, raw: RawVoiceChannel) {
        super(client, raw)
    }

    async ack(): Promise<void> {
        throw new TypeError('Cannot ack voice channel')
    }
}
