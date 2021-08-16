import { DirectMessageChannel as RawDMChannel } from 'revolt-api/types/Channels'
import { Client } from '..'
import { ChannelTypes } from '../util/Constants'
import { TextBasedChannel } from './interfaces/TextBasedChannel'

export class DMChannel extends TextBasedChannel {
    active: boolean
    constructor(client: Client, raw: RawDMChannel) {
        super(client, raw)
        this.active = raw.active
        this.type = ChannelTypes.DM
    }
}
