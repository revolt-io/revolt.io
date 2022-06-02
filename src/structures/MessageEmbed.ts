import type { API } from '../../deps.ts';

export type EmbedImage = Extract<API.Embed, { type: 'Image' }>;
export type EmbedVideo = Extract<API.Embed, { type: 'Video' }>;
export type EmbedSpecial = API.Special;
export type Embed = API.Embed;

export class MessageEmbed {
  #url?: string;
  #title?: string;
  #description?: string;
  #icon_url?: string;
  #color?: string;
  #media?: string;

  setTitle(title: string): this {
    this.#title = title;
    return this;
  }

  setIcon(iconURL: string): this {
    this.#icon_url = iconURL;
    return this;
  }

  setColor(color: string): this {
    this.#color = color;
    return this;
  }

  setDescription(description: string): this {
    this.#description = description;
    return this;
  }

  setURL(url: string): this {
    this.#url = url;
    return this;
  }

  setMedia(media: string): this {
    this.#media = media;
    return this;
  }

  toJSON(): API.SendableEmbed {
    return {
      title: this.#title,
      description: this.#description,
      url: this.#url,
      icon_url: this.#icon_url,
      colour: this.#color,
      media: this.#media,
    };
  }
}
