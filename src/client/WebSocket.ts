import { Session } from 'revolt-api/types/Auth'
import { default as Socket } from 'ws'
import { Client } from './Client'
import { ClientUser } from '../structures'
import { Events, WSEvents } from '../util'

export class WebSocket {
    heartbeatInterval?: NodeJS.Timeout
    lastPingTimestamp?: number
    socket: Socket | null = null
    connected = false
    ready = false

    constructor(public client: Client) {}

    private debug(message: unknown): void {
        this.client.emit(Events.DEBUG, `[WS]: ${message}`)
    }

    setHeartbeatTimer(time: number): void {
        this.debug(`Setting a heartbeat interval for ${time}ms.`)

        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)

        this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), time).unref()
    }

    sendHeartbeat(type = 'Ping'): void {
        const now = Date.now()
        this.debug(`[${type}] Sending a heartbeat.`)
        this.send({ type, time: now })
        this.lastPingTimestamp = now
    }

    send(data: unknown): void {
        if (this.socket?.readyState === Socket.OPEN) {
            this.socket.send(JSON.stringify(data))
        } else {
            this.debug(`Tried to send packet '${JSON.stringify(data)}' but no WebSocket is available!`)
        }
    }

    private onError(event: Socket.ErrorEvent): void {
        const error = event?.error ?? event

        if (error) {
            this.client.emit(Events.ERROR, error)
        }
    }

    private onMessage({ data }: Socket.MessageEvent): void {
        let packet: unknown

        try {
            packet = JSON.parse(data as unknown as string)
        } catch (err) {
            this.client.emit(Events.ERROR, err)
            return
        }

        this.client.emit(Events.RAW, packet)

        this.onPacket(packet)
    }

    private onOpen(): void {
        if (typeof this.client.session === 'string') {
            this.send({ type: WSEvents.AUTHENTICATE, token: this.client.session })
        } else {
            this.send({ type: WSEvents.AUTHENTICATE, ...(this.client.session as Session) })
        }
    }

    private onClose(event: Socket.CloseEvent): void {
        this.debug(`[WS] Closed with reason: ${event.reason}, code: ${event.code}`)
        this.destroy()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private onPacket(packet: any) {
        if (!packet) {
            this.debug(`Received broken packet: '${packet}'.`)
            return
        }

        const action = this.client.actions.get(packet.type)

        switch (packet.type) {
            case WSEvents.AUTHENTICATED:
                this.connected = true
                break
            case WSEvents.ERROR:
                this.client.emit(Events.ERROR, packet.error)
                break
            case WSEvents.READY:
                for (const user of packet.users) {
                    this.client.users._add(user)
                    if (user.relationship === 'User' && !this.client.user) {
                        const clientUser = (this.client.user = new ClientUser(this.client, user))
                        this.client.users.cache.set(clientUser.id, clientUser)
                    }
                }

                for (const channel of packet.channels) {
                    this.client.channels._add(channel)
                }

                for (const server of packet.servers) {
                    this.client.servers._add(server)
                }

                for (const member of packet.members) {
                    this.client.servers.cache.get(member._id.server)?.members._add(member)
                }

                this.setHeartbeatTimer(this.client.options.heartbeat)

                this.ready = true

                this.client.emit(Events.READY, this.client)

                break
            default:
                if (action) {
                    action.handle(packet)
                } else {
                    this.debug(`Received unknown packet "${packet.type}"`)
                }
                break
        }
    }

    connect(): Promise<this> {
        return new Promise(resolve => {
            if (this.socket?.readyState === Socket.OPEN && this.ready) {
                return resolve(this)
            }

            if (typeof this.client.configuration === 'undefined') {
                throw new Error('Attempted to open WebSocket without syncing configuration from server.')
            }

            if (typeof this.client.session === 'undefined') {
                throw new Error('Attempted to open WebSocket without valid session.')
            }

            const ws = (this.socket = this.socket ?? new Socket(this.client.configuration.ws))

            ws.onopen = this.onOpen.bind(this)
            ws.onmessage = this.onMessage.bind(this)
            ws.onerror = this.onError.bind(this)
            ws.onclose = this.onClose.bind(this)
            ws.once('open', () => resolve(this))
        })
    }

    destroy(): Promise<this> {
        return new Promise(resolve => {
            if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)

            this.connected = false
            this.ready = false

            if (this.socket?.readyState === Socket.OPEN) {
                this.socket.close()
                this.socket.once('close', () => resolve(this))
            } else {
                resolve(this)
            }
        })
    }
}
