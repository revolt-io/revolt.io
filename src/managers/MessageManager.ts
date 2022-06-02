import type { API } from '../../deps.ts';
import { BaseManager } from './BaseManager.ts';
import { TypeError } from '../errors/mod.ts';
import { Channel, Message, MessageEmbed } from '../structures/mod.ts';
import { Collection, UUID } from '../util/mod.ts';

export type MessageResolvable = Message | API.Message | string;

export interface MessageReply {
  id: string;
  mention: boolean;
}

export interface MessageOptions {
  content?: string;
  replies?: MessageReply[];
  attachments?: string[];
  embeds?: MessageEmbed[];
}

export interface MessageEditOptions {
  content?: string;
  attachments?: string[];
  embeds?: MessageEmbed[];
}

export interface MessageSearchOptions {
  query: string;
  limit?: number;
  before?: string;
  after?: string;
  sort?: API.MessageSort;
}

export interface MessageQueryOptions {
  limit?: number;
  before?: string;
  after?: string;
  sort?: API.MessageSort;
  nearby?: string;
}

export class MessageManager extends BaseManager<Message, API.Message> {
  holds = Message;
  constructor(protected readonly channel: Channel) {
    super(channel.client);
  }

  async send(content: MessageOptions | string): Promise<Message> {
    if (typeof content === 'string') content = { content };

    const data = await this.client.api.post(
      `/channels/${this.channel.id}/messages`,
      {
        body: { ...content, nonce: UUID.generate() },
      },
    ) as API.Message;

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
    options: MessageEditOptions | string,
  ): Promise<void> {
    const id = this.resolveId(message);

    if (!id) {
      throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable');
    }

    if (typeof options === 'string') options = { content: options };

    await this.client.api.patch(`/channels/${this.channel.id}/messages/${id}`, {
      body: options,
    });
  }

  async search(
    query: MessageSearchOptions | string,
  ): Promise<Collection<string, Message>> {
    if (typeof query === 'string') query = { query };

    const response = await this.client.api.post(
      `/channels/${this.channel.id}/search`,
      {
        query: query as Required<MessageSearchOptions>,
      },
    ) as API.Message[];

    return response.reduce((coll, cur) => {
      const msg = this._add(cur);
      coll.set(msg.id, msg);
      return coll;
    }, new Collection<string, Message>());
  }

  fetch(message: MessageResolvable): Promise<Message>;
  fetch(query?: MessageQueryOptions): Promise<Collection<string, Message>>;
  fetch(limit: number): Promise<Collection<string, Message>>;
  async fetch(
    query?: MessageResolvable | MessageQueryOptions | number,
  ): Promise<Collection<string, Message> | Message> {
    const id = this.resolveId(query as string);

    if (id) {
      const data = await this.client.api.get(
        `/channels/${this.channel.id}/messages/${id}`,
      ) as API.Message;
      return this._add(data);
    }

    if (typeof query === 'number') query = { limit: query };
    else if (typeof query === 'undefined') query = { limit: 100 };

    const messages = await this.client.api.get(
      `/channels/${this.channel.id}/messages`,
      { query: query as Required<MessageQueryOptions> },
    );

    return (messages as API.Message[]).reduce((coll, cur) => {
      const msg = this._add(cur);
      coll.set(msg.id, msg);
      return coll;
    }, new Collection<string, Message>());
  }
}
