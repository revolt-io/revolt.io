import { User } from './User.ts';
import { NotesChannel, Status } from './mod.ts';

export class ClientUser extends User {
  notes: NotesChannel | null = null;

  async setUsername(username: string, password?: string): Promise<void> {
    if (this.bot && password) {
      throw new Error('Bots did not have passwords');
    }

    await this.client.api.patch('/users/@me/username', {
      body: { username, password },
    });
  }

  async setStatus(text: string | null, presence?: Status): Promise<void> {
    await this.client.api.patch('/users/@me', {
      body: { status: { text, presence } },
    });
  }
}
