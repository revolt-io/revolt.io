import type { API } from '../../deps.ts';

export type EmbedImage = Extract<API.Embed, { type: 'Image' }>;
export type EmbedVideo = Extract<API.Embed, { type: 'Video' }>;
export type EmbedSpecial = API.Special;

export class MessageEmbed {
  type: API.Embed['type'] = 'Website';
  url?: string;
  special?: EmbedSpecial;
  title?: string;
  description?: string;
  image?: EmbedImage;
  video?: EmbedVideo;
  site_name?: string;
  icon_url?: string;
  color?: string;

  constructor(data: Partial<API.Embed> = {}) {
    Object.assign(this, data);
  }

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  setIcon(iconURL: string): this {
    this.icon_url = iconURL;
    return this;
  }

  setColor(color: string): this {
    this.color = color;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  setURL(url: string): this {
    this.url = url;
    return this;
  }

  toJSON(): unknown {
    return {
      title: this.title,
      type: this.type,
      description: this.description,
      url: this.url,
    };
  }
}
