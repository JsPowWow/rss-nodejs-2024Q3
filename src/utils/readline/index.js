import readline from 'node:readline/promises';
import process from 'node:process';

/**
 * @return {module:readline/promises.Interface}
 */
export const createReadline = () => readline.createInterface({input: process.stdin, output: process.stdout});

/**
 * @param {module:readline/promises.Interface} rl
 * @return {never}
 */
export const exitFromReadline = (rl) => process.exit(0);

/**
 * @param {module:readline/promises.Interface} rl
 * @return {void}
 */
export const closeReadline = (rl) => rl.close();
