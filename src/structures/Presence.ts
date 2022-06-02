import { Base } from './Base.ts';

export enum Status {
  Online = 'ONLINE',
  Idle = 'IDLE',
  Busy = 'DND',
  Invisible = 'OFFLINE',
}

export class Presence extends Base {
  text: string | null = null;
  status = Status.Invisible;
}
