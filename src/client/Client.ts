import type { RevoltConfig } from 'revolt-api'
import { BaseClient, WebSocket } from './index'
import { ActionManager } from './actions/ActionManager'
import { Error } from '../errors/index'
import { ChannelManager, ServerManager, UserManager } from '../managers/index'
import { ClientUser } from '../structures/index'
import { Events } from '../util/Constants'

export class Client extends BaseClient {
    protected readonly ws = new WebSocket(this)
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
        if (!token) throw new Error('INVALID_TOKEN')

        this.debug('Fetch configuration...')

        this.configuration = await this.api.get('/')
        this.bot = type.toLowerCase() === 'bot'
        this.token = token ?? null

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
        this.api.setToken(null)
        await this.ws.destroy()
    }

    private debug(message: string): void {
        this.emit(Events.DEBUG, message)
    }

    isReady(): boolean {
        return this.readyAt != null
    }
}
