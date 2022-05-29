export const Messages = {
  INVALID_TYPE: (name: string, expected: string, an = false): string =>
    `Supplied ${name} is not a${an ? 'n' : ''} ${expected}.`,
  BITFIELD_INVALID: (bit: unknown): string =>
    `Invalid bitfield flag or number: ${bit}.`,
  INVALID_TOKEN: () => 'Invalid token received',
  MISSING_CONFIGURATION_SYNC: () =>
    'Attempted to open WebSocket without syncing configuration from server.',
};
