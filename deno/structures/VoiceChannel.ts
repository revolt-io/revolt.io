import type { Channel as APIChannel } from 'https://deno.land/x/revolt_api@0.4.0/types.ts'
import { ServerChannel } from './index.ts'
import { Client } from '../index.ts'
import { ChannelTypes } from '../util/index.ts'

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