import { Channel as APIChannel } from 'revolt-api'
import { ServerChannel } from './index'
import { Client } from '../index'
import { ChannelTypes } from '../util/index'

type APIVoiceChannel = Extract<APIChannel, { channel_type: 'VoiceChannel' }>

export class VoiceChannel extends ServerChannel {
    readonly type = ChannelTypes.VOICE
    constructor(client: Client, data: APIVoiceChannel) {
        super(client, data)
        this._patch(data)
    }

    protected _patch(data: APIVoiceChannel): this {
        super._patch(data)
        return this
    }

    async ack(): Promise<void> {
        throw new TypeError('Cannot ack voice channel')
    }
}
