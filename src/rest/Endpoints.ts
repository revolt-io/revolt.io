export interface EndPointsOptions {
    cdn: string
    invite: string
    api: string
}

export class Endpoints {
    constructor(private options: EndPointsOptions) {}

    get CDN(): string {
        return this.options.cdn
    }

    get INVITE(): string {
        return this.options.invite
    }

    get API(): string {
        return this.options.api
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
}
