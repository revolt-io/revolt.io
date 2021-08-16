import { Client } from '..'
import { VoiceChannel as RawVoiceChannel } from 'revolt-api/types/Channels'
import { ServerChannel } from './ServerChannel'
import { ChannelTypes } from '../util/Constants'

export class VoiceChannel extends ServerChannel {
    constructor(client: Client, raw: RawVoiceChannel) {
        super(client, raw)
        this.type = ChannelTypes.VOICE
    }

    async ack(): Promise<void> {
        throw new TypeError('cannot ack voice channel')
    }
}
