import type { Embed, Special } from 'revolt-api'

export type EmbedImage = Extract<Embed, { type: 'Image' }>
export type EmbedVideo = Extract<Embed, { type: 'Video' }>
export type EmbedSpecial = Special

export class MessageEmbed {
    type: Embed['type'] = 'Website'
    url?: string
    special?: EmbedSpecial
    title?: string
    description?: string
    image?: EmbedImage
    video?: EmbedVideo
    site_name?: string
    icon_url?: string
    color?: string

    constructor(data: Partial<Embed> = {}) {
        Object.assign(this, data)
    }

    setTitle(title: string): this {
        this.title = title
        return this
    }

    setIcon(iconURL: string): this {
        this.icon_url = iconURL
        return this
    }

    setColor(color: string): this {
        this.color = color
        return this
    }

    setDescription(description: string): this {
        this.description = description
        return this
    }

    setURL(url: string): this {
        this.url = url
        return this
    }

    toJSON(): unknown {
        return {
            title: this.title,
            type: this.type,
            description: this.description,
            url: this.url
        }
    }
}
