import type { RevoltConfig } from 'https://deno.land/x/revolt_api@0.4.0/types.ts';
import { BaseClient, WebSocketShard } from './mod.ts';
import { ActionManager } from './actions/ActionManager.ts';
import { Error } from '../errors/mod.ts';
import { ChannelManager, ServerManager, UserManager } from '../managers/mod.ts';
import { ClientUser } from '../structures/mod.ts';

export class Client extends BaseClient {
  protected readonly ws = new WebSocketShard(this);
  readonly actions = new ActionManager(this);
  readonly channels = new ChannelManager(this);
  readonly servers = new ServerManager(this);
  readonly users = new UserManager(this);
  user: ClientUser | null = null;
  configuration?: RevoltConfig;
  readyAt: Date | null = null;

  get readyTimestamp(): number | null {
    return this.readyAt?.getTime() ?? null;
  }

  get uptime(): number | null {
    return this.readyAt ? Date.now() - this.readyAt.getTime() : null;
  }

  async login(token?: string, type: 'user' | 'bot' = 'bot'): Promise<void> {
    if (!token) throw new Error('INVALID_TOKEN');

    this.bot = type.toLowerCase() === 'bot';
    this.token = token ?? null;

    this.debug('Fetch configuration...');
    this.configuration = await this.api.get('/');

    this.debug('Preparing to connect to the gateway...');

    try {
      await this.ws.connect();
    } catch (err) {
      await this.destroy();
      throw err;
    }

    this.readyAt = new Date();
  }

  async destroy(): Promise<void> {
    this.token = null;
    this.user = null;
    this.readyAt = null;
    await this.ws.destroy();
  }

  isReady(): boolean {
    return this.readyAt != null;
  }
}
