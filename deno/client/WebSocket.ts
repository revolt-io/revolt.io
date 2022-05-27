/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Client } from './Client.ts'
import { ClientUser } from '../structures/index.ts'
import { Events, WSEvents } from '../util/index.ts'

export class WebSocketShard {
    heartbeatInterval?: number
    lastPingTimestamp?: number
    lastPongAcked = false
    socket: WebSocket | null = null
    connected = false
    ready = false

    constructor(protected readonly client: Client) {}

    send(data: unknown): Promise<void> {
        return new Promise(resolve => {
            if (this.socket?.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify(data))
                resolve()
            } else {
                this.debug(`Tried to send packet '${JSON.stringify(data)}' but no WebSocket is available!`)
                resolve()
            }
        })
    }

    private async onOpen(): Promise<void> {
        await this.send({
            type: WSEvents.AUTHENTICATE,
            token: this.client.token
        })
    }

    private debug(message: unknown): void {
        this.client.emit(Events.DEBUG, `[WS]: ${message}`)
    }

    get ping(): number {
        if (!this.lastPingTimestamp) return -0
        return Date.now() - this.lastPingTimestamp
    }

    setHeartbeatTimer(time: number): void {
        this.debug(`Setting a heartbeat interval for ${time}ms.`)

        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)

        if (time !== -1) {
            this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), time)
        }
    }

    sendHeartbeat(skip = false): void {
        if (!skip && !this.lastPongAcked) {
            this.debug('Did not receive a pong ack last time.')
        }

        const now = Date.now()

        this.debug('Sending a heartbeat.')
        this.send({ type: WSEvents.PING, data: now })
        this.lastPongAcked = false
        this.lastPingTimestamp = now
    }

    private onError(event: ErrorEvent | Event): void {
        this.client.emit(Events.ERROR, event)
    }

    private onMessage({ data }: MessageEvent): void {
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

    private onClose(event: CloseEvent): void {
        this.debug(`[WS] Closed with reason: ${event.reason}, code: ${event.code}`)
        this.destroy()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private onPacket(packet: any) {
        if (!packet) {
            this.debug(`Received broken packet: '${packet}'.`)
            return
        }

        switch (packet.type) {
            case WSEvents.AUTHENTICATED:
                this.connected = true
                break
            case WSEvents.PONG:
                this.lastPongAcked = true
                break
            case WSEvents.ERROR:
                this.client.emit(Events.ERROR, packet.error)
                break
            case WSEvents.READY:
                this.lastPongAcked = true

                for (const user of packet.users) {
                    this.client.users._add(user)
                    if (user.relationship === 'User' && !this.client.user) {
                        const clientUser = (this.client.user = new ClientUser(this.client, user))
                        this.client.users.cache.set(clientUser.id, clientUser)
                    }
                }

                for (const server of packet.servers) {
                    this.client.servers._add(server)
                }

                for (const channel of packet.channels) {
                    this.client.channels._add(channel)
                }

                for (const member of packet.members) {
                    this.client.servers.cache.get(member._id.server)?.members._add(member)
                }

                this.setHeartbeatTimer(this.client.options.ws.heartbeat)

                this.ready = true

                this.client.emit(Events.READY, this.client)

                break
            default: {
                const action = this.client.actions.get(packet.type)

                if (action) {
                    action.handle(packet)
                } else {
                    this.debug(`Received unknown packet "${packet.type}"`)
                }

                break
            }
        }
    }

    connect(): Promise<this> {
        return new Promise(resolve => {
            if (this.socket?.readyState === WebSocket.OPEN && this.ready) {
                return resolve(this)
            }

            if (typeof this.client.configuration === 'undefined') {
                throw new Error('Attempted to open WebSocket without syncing configuration from server.')
            }

            if (typeof this.client.token !== 'string') {
                throw new Error('Attempted to open WebSocket without valid token.')
            }

            const ws = (this.socket = this.socket ?? new WebSocket(this.client.configuration.ws))

            // NOTE: Don't remove the 'any' they are requires to work with deno
            ws.onopen = this.onOpen.bind(this) as any
            ws.onmessage = this.onMessage.bind(this) as any
            ws.onerror = this.onError.bind(this) as any
            ws.onclose = this.onClose.bind(this) as any
            ws.addEventListener('open', () => resolve(this))
        })
    }

    destroy(): Promise<this> {
        return new Promise(resolve => {
            this.setHeartbeatTimer(-1)
            this.connected = false
            this.ready = false

            if (this.socket?.readyState === WebSocket.OPEN) {
                this.socket.addEventListener('close', () => resolve(this))
                this.socket.close()
            } else {
                resolve(this)
            }
        })
    }
}
