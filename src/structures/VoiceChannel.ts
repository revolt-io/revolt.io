import type { API } from '../../deps.ts';
import { ServerChannel } from './mod.ts';
import { Client } from '../lib.ts';
import { ChannelTypes } from '../util/mod.ts';

type APIVoiceChannel = Extract<API.Channel, { channel_type: 'VoiceChannel' }>;

export class VoiceChannel extends ServerChannel {
  readonly type = ChannelTypes.VOICE;
  constructor(client: Client, data: APIVoiceChannel) {
    super(client, data);
    this._patch(data);
  }

  protected _patch(data: APIVoiceChannel): this {
    super._patch(data);
    return this;
  }

  ack(): Promise<void> {
    throw new TypeError('Cannot ack voice channel');
  }
}
