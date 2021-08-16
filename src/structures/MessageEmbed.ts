import { Embed } from 'revolt-api/types/January'

export type EmbedImage = {
    url: string
    width: number
    height: number
    size: 'Large' | 'Preview'
}

export type EmbedVideo = {
    url: string
    width: number
    height: number
}

export type EmbedSpecial =
    | { type: 'None' }
    | { type: 'YouTube'; id: string }
    | { type: 'Twitch'; content_type: 'Channel' | 'Video' | 'Clip'; id: string }
    | { type: 'Spotify'; content_type: string; id: string }
    | { type: 'Soundcloud' }
    | { type: 'Bandcamp'; content_type: 'Album' | 'Track'; id: string }

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

    setIconURL(iconURL: string): this {
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
