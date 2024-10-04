import os from 'node:os';

/**
 * @param {string} s
 * @return {string}
 */
export const textLine = s => `${s}${os.EOL}`;
