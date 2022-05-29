import type { Channel as APIChannel } from 'https://deno.land/x/revolt_api@0.4.0/types.ts';
import { BaseManager } from './BaseManager.ts';
import { TypeError } from '../errors/mod.ts';
import {
  Channel,
  DMChannel,
  GroupChannel,
  NotesChannel,
  TextChannel,
  VoiceChannel,
} from '../structures/mod.ts';

export type ChannelResolvable = Channel | APIChannel | string;

export class ChannelManager extends BaseManager<Channel, APIChannel> {
  holds = null;

  _add(data: APIChannel): Channel {
    let channel: Channel;

    switch (data.channel_type) {
      case 'TextChannel':
        channel = new TextChannel(this.client, data);
        break;
      case 'VoiceChannel':
        channel = new VoiceChannel(this.client, data);
        break;
      case 'DirectMessage':
        channel = new DMChannel(this.client, data);
        break;
      case 'Group':
        channel = new GroupChannel(this.client, data);
        break;
      case 'SavedMessages':
        channel = new NotesChannel(this.client, data);
        if (this.client.user) this.client.user.notes = channel as NotesChannel;
        break;
      default:
        throw new Error(`Unknown Channel Type: ${data}`);
    }

    this.cache.set(channel.id, channel);

    return channel;
  }

  _remove(id: string): void {
    const channel = this.cache.get(id);

    if (channel?.inServer()) {
      channel.server?.channels.cache.delete(id);
    }

    super._remove(id);
  }

  async delete(channel: ChannelResolvable): Promise<void> {
    const id = this.resolveId(channel);
    if (!id) {
      throw new TypeError('INVALID_TYPE', 'channel', 'ChannelResolvable');
    }
    await this.client.api.delete(`/channels/${id}`);
  }

  async fetch(
    channel: ChannelResolvable,
    { force = true } = {},
  ): Promise<Channel> {
    const id = this.resolveId(channel);

    if (!id) {
      throw new TypeError('INVALID_TYPE', 'channel', 'ChannelResolvable');
    }

    if (!force) {
      const channel = this.cache.get(id);
      if (channel) return channel;
    }

    const data = await this.client.api.get(`/channels/${id}`);

    return this._add(data);
  }

  resolve(channel: ChannelResolvable): Channel | null {
    if (channel instanceof Channel) return channel;
    return super.resolve(channel);
  }

  resolveId(channel: ChannelResolvable): string | null {
    if (channel instanceof Channel) return channel.id;
    return super.resolveId(channel);
  }
}
