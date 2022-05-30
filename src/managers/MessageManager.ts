import type { Message as APIMessage } from 'revolt-api-types';
import { BaseManager } from './BaseManager.ts';
import { TypeError } from '../errors/mod.ts';
import { Channel, Message } from '../structures/mod.ts';
import { Collection, UUID } from '../util/mod.ts';

export type MessageResolvable = Message | APIMessage | string;

export interface EditMessageOptions {
  content?: string;
}

export interface MessageOptions {
  content: string;
  replies?: unknown[];
  attachments?: string[];
}

export interface MessageSearchOptions {
  query: string;
  limit?: number;
  before?: string;
  after?: string;
  sort?: 'Relevance' | 'Latest' | 'Oldest';
}

export interface MessageQueryOptions {
  limit?: number;
  before?: string;
  after?: string;
  sort?: 'Relevance' | 'Latest' | 'Oldest';
  nearby?: string;
}

export class MessageManager extends BaseManager<Message, APIMessage> {
  holds = Message;
  constructor(protected readonly channel: Channel) {
    super(channel.client);
  }

  async send(options: MessageOptions | string): Promise<Message> {
    const { content, replies, attachments }: MessageOptions =
      typeof options === 'object' ? { ...options } : { content: options };

    const data = await this.client.api.post(
      `/channels/${this.channel.id}/messages`,
      {
        body: {
          content,
          nonce: UUID.generate(),
          replies,
          attachments,
        },
      },
    ) as APIMessage;

    return this._add(data);
  }

  async ack(message: MessageResolvable): Promise<void> {
    const id = this.resolveId(message);
    if (!id) {
      throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable');
    }
    await this.client.api.put(`/channels/${this.channel.id}/ack/${id}`);
  }

  async bulkDelete(
    messages: MessageResolvable[] | number | Collection<string, Message>,
  ): Promise<void> {
    let ids: string[] = [];

    if (typeof messages === 'number') {
      messages = await this.fetch(messages);
      ids = [...messages.keys()];
    } else if (messages instanceof Collection) {
      ids = [...messages.keys()];
    } else {
      ids = messages.map((m) => this.resolveId(m)!).filter(Boolean);
    }

    await this.client.api.delete(`/channels/${this.channel.id}/messages/bulk`, {
      body: { ids },
    });
  }

  async delete(message: MessageResolvable): Promise<void> {
    const id = this.resolveId(message);
    if (!id) {
      throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable');
    }
    await this.client.api.delete(`/channels/${this.channel.id}/messages/${id}`);
  }

  async edit(
    message: MessageResolvable,
    options: EditMessageOptions,
  ): Promise<void> {
    const id = this.resolveId(message);
    if (!id) {
      throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable');
    }
    await this.client.api.patch(`/channels/${this.channel.id}/messages/${id}`, {
      body: options,
    });
  }

  async search(
    query: MessageSearchOptions,
  ): Promise<Collection<string, Message>> {
    const response =
      (await this.client.api.post(`/channels/${this.channel.id}/search`, {
        query: query as Required<MessageSearchOptions>,
      })) as APIMessage[];
    return response.reduce((coll, cur) => {
      const msg = this._add(cur);
      coll.set(msg.id, msg);
      return coll;
    }, new Collection<string, Message>());
  }

  fetch(messageId: string): Promise<Message>;
  fetch(query: MessageQueryOptions): Promise<Collection<string, Message>>;
  fetch(limit: number): Promise<Collection<string, Message>>;
  async fetch(
    query?: string | MessageQueryOptions | number,
  ): Promise<Collection<string, Message> | Message> {
    if (typeof query === 'string') {
      const data = await this.client.api.get(
        `/channels/${this.channel.id}/messages/${query}`,
      ) as APIMessage;
      return this._add(data);
    }

    if (typeof query === 'number') query = { limit: query };

    const messages = await this.client.api.get(
      `/channels/${this.channel.id}/messages`,
      { query: query as Required<MessageQueryOptions> },
    );

    return (messages as APIMessage[]).reduce((coll, cur) => {
      const msg = this._add(cur);
      coll.set(msg.id, msg);
      return coll;
    }, new Collection<string, Message>());
  }
}
