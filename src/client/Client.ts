/* eslint-disable @typescript-eslint/no-explicit-any */
import { RevoltConfiguration } from 'revolt-api/types/Core'
import { BaseClient } from './BaseClient'
import { WebSocket } from './WebSocket'
import { ActionManager } from './actions/ActionManager'
import { ChannelManager, ServerManager, UserManager } from '../managers'
import { ClientUser } from '../structures/ClientUser'
import { Events } from '../util/Constants'

export type LoginDetails = string | { token: string; type?: 'bot' | 'user' }

export class Client extends BaseClient {
    private readonly ws: WebSocket = new WebSocket(this)
    public readonly actions = new ActionManager(this)
    public readonly channels = new ChannelManager(this)
    public configuration?: RevoltConfiguration
    public readyAt: Date | null = null
    public readonly servers = new ServerManager(this)
    public user: ClientUser | null = null
    public readonly users = new UserManager(this)

    get readyTimestamp(): number | null {
        return this.readyAt?.getTime() ?? null
    }

    get uptime(): number | null {
        return this.readyAt ? Date.now() - this.readyAt.getTime() : null
    }

    async login(details: LoginDetails): Promise<void> {
        this.configuration = await this.api.get('/')

        if (typeof details === 'object') {
            const { type = 'bot', token } = details
            this.token = token
            this.bot = type.toLowerCase() === 'bot'
        } else {
            this.token = details
            this.bot = true
        }

        this.debug('Preparing to connect to the gateway...')

        try {
            await this.ws.connect()
        } catch (err) {
            await this.destroy()
            throw err
        }

        this.readyAt = new Date()
    }

    async destroy(): Promise<void> {
        this.token = null
        this.user = null
        this.readyAt = null
        await this.ws.destroy()
    }

    private debug(message: string): void {
        this.emit(Events.DEBUG, message)
    }

    isReady(): boolean {
        return this.readyAt != null
    }
}
