/* eslint-disable @typescript-eslint/no-explicit-any */
import { RevoltConfig } from 'revolt-api'
import { BaseClient } from './BaseClient'
import { WebSocket } from './WebSocket'
import { ActionManager } from './actions/ActionManager'
import { ChannelManager, ServerManager, UserManager } from '../managers'
import { ClientUser } from '../structures/ClientUser'
import { Events } from '../util/Constants'

export class Client extends BaseClient {
    protected readonly ws: WebSocket = new WebSocket(this)
    readonly actions = new ActionManager(this)
    readonly channels = new ChannelManager(this)
    readonly servers = new ServerManager(this)
    readonly users = new UserManager(this)
    user: ClientUser | null = null
    configuration?: RevoltConfig
    readyAt: Date | null = null

    get readyTimestamp(): number | null {
        return this.readyAt?.getTime() ?? null
    }

    get uptime(): number | null {
        return this.readyAt ? Date.now() - this.readyAt.getTime() : null
    }

    async login(token?: string, type: 'user' | 'bot' = 'bot'): Promise<void> {
        this.debug('Fetch configuration...')

        this.configuration = await this.api.get('/')
        this.bot = type === 'bot'

        Object.defineProperty(this, 'token', {
            value: token,
            writable: true,
            enumerable: false,
            configurable: true
        })

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
