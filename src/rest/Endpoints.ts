import type { BaseClientOptions } from '../client/index'

export type EndpointsOptions = BaseClientOptions['endpoints']

export class Endpoints {
    constructor(private readonly options: EndpointsOptions) {}

    get CDN(): string {
        return this.options.cdn
    }

    get INVITE(): string {
        return this.options.invite
    }

    get API(): string {
        return this.options.api
    }

    defaultAvatar(id: string): string {
        return `${this.API}/users/${id}/default_avatar`
    }

    avatar(hash: string, filename: string, size = 1024): string {
        return `${this.CDN}/avatars/${hash}/${filename}?max_side=${size}`
    }

    icon(hash: string, size = 1024): string {
        return `${this.CDN}/icons/${hash}?max_side=${size}`
    }

    invite(code: string): string {
        return `${this.INVITE}/${code}`
    }

    banner(hash: string, size = 1024): string {
        return `${this.CDN}/banners/${hash}?max_side=${size}`
    }
}
