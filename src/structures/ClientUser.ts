import type { NotesChannel } from './index'
import { User } from './User'

export class ClientUser extends User {
    notes: NotesChannel | null = null

    async setUsername(username: string, password?: string): Promise<void> {
        await this.client.api.patch('/users/@me/username', {
            body: { username, password }
        })
    }

    async setStatus(status: { text?: string; presence?: 'Online' | 'Idle' | 'Busy' | 'Invisible' }): Promise<void> {
        await this.client.api.patch('/users/@me', { body: { status } })
    }
}
