import { Base } from './Base.ts';
import type {
  DMChannel,
  GroupChannel,
  ServerChannel,
  TextChannel,
  VoiceChannel,
} from './mod.ts';
import { ChannelTypes, UUID } from '../util/mod.ts';

export abstract class Channel extends Base {
  type: ChannelTypes | 'UNKNOWN' = 'UNKNOWN';

  get createdTimestamp(): number {
    return this.createdAt.getTime();
  }

  get createdAt(): Date {
    return UUID.timestampOf(this.id);
  }

  delete(): Promise<void> {
    return this.client.channels.delete(this);
  }

  isText(): this is TextChannel | GroupChannel | DMChannel {
    return 'messages' in this;
  }

  isVoice(): this is VoiceChannel {
    return this.type === ChannelTypes.VOICE;
  }

  isGroup(): this is GroupChannel {
    return this.type === ChannelTypes.GROUP;
  }

  inServer(): this is ServerChannel {
    return 'serverId' in this;
  }

  toString(): string {
    return `<#${this.id}>`;
  }

  fetch(force = true): Promise<Channel> {
    return this.client.channels.fetch(this, { force });
  }
}
