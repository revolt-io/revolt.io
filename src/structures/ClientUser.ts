import { User } from '.'
import { NotesChannel } from './NotesChannel'

export class ClientUser extends User {
    notes: NotesChannel | null = null

    async setUsername(username: string, password?: string): Promise<void> {
        await this.client.api.patch(`/users/${this.id}/username`, {
            body: {
                username,
                password
            }
        })
    }

    async setStatus(status: { text?: string; presence?: 'Online' | 'Idle' | 'Busy' | 'Invisible' }): Promise<void> {
        await this.client.api.patch('/users/id', {
            body: { status }
        })
    }
}
