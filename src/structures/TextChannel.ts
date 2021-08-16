import { TextChannel as RawTextChannel } from 'revolt-api/types/Channels'
import { Client } from '..'
import { ChannelTypes } from '../util/Constants'
import { ServerTextBasedChannel } from './interfaces/ServerTextBasedChannel'

export class TextChannel extends ServerTextBasedChannel {
    constructor(client: Client, raw: RawTextChannel) {
        super(client, raw)
        this.type = ChannelTypes.TEXT
    }
}
