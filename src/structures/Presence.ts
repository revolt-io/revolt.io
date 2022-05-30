import { Base } from './Base.ts';

export enum Status {
  ONLINE = 'ONLINE',
  IDLE = 'IDLE',
  BUSY = 'DND',
  INVISIBLE = 'OFFLINE',
}

export class Presence extends Base {
  text: string | null = null;
  status = Status.INVISIBLE;
}
