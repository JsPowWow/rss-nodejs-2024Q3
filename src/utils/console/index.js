import os from 'node:os';

/**
 * @param {string} s
 * @return {string}
 */
const textLine = s => `${s}${os.EOL}`;


/**
 * @param {string} s
 * @return {void}
 */
export const logTextLine = s => console.log(textLine(s));



