import { BitField } from './BitField.ts';

export type BadgeString = keyof typeof Badges.FLAGS;
export type BadgesResolvable =
  | number
  | BadgeString
  | Badges
  | BadgesResolvable[];

export declare interface Badges {
  serialize(): Record<BadgeString, boolean>;
  any(bit: BadgesResolvable): boolean;
  add(...bits: BadgesResolvable[]): this;
  remove(...bits: BadgesResolvable[]): this;
  has(bit: BadgesResolvable): boolean;
}

export class Badges extends BitField {
  static readonly FLAGS = {
    DEVELOPER: 1 << 0,
    TRANSLATOR: 1 << 1,
    SUPPORTER: 1 << 2,
    RESPONSIBLE_DISCLOSURE: 1 << 3,
    REVOLT_TEAM: 1 << 4,
    EARLY_ADOPTER: 1 << 8,
  } as const;

  constructor(bits?: BadgesResolvable) {
    super(bits);
  }

  static resolve(bit: BadgesResolvable): number {
    return super.resolve(bit);
  }
}
