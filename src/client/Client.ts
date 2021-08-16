/* eslint-disable @typescript-eslint/no-explicit-any */
import { RevoltConfiguration } from 'revolt-api/types/Core'
import { ChannelManager, ServerManager, UserManager } from '../managers'
import { ClientUser } from '../structures/ClientUser'
import { Events } from '../util/Constants'
import { ActionManager } from './actions/ActionManager'
import { BaseClient } from './BaseClient'
import { WebSocket } from './WebSocket'

export type LoginDetails =
    | {
          email: string
          password: string
      }
    | {
          id: string
          token: string
      }
    | string

export class Client extends BaseClient {
    private readonly ws = new WebSocket(this)
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

    private debug(message: unknown): void {
        this.emit(Events.DEBUG, message)
    }

    async login(details: LoginDetails): Promise<void> {
        this.configuration = await this.api.get('/')

        if (typeof details === 'string') {
            this.session = details
        } else if ('id' in details && 'token' in details) {
            this.session = {
                user_id: details.id,
                session_token: details.token
            }
            await this.api.get('/auth/check')
        } else {
            this.session = await this.api.post('/auth/login', { body: details })
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

    isReady(): boolean {
        return this.readyAt != null
    }

    async logout(): Promise<void> {
        await this.api.get('/auth/logout')
        await this.destroy()
    }

    async destroy(): Promise<void> {
        this.session = null
        this.user = null
        this.readyAt = null
        await this.ws.destroy()
    }
}
