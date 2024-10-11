import readline from 'node:readline/promises';

/**
 * @param {object} options
 * @param {string[]} [options.history]
 * @return {module:readline/promises.Interface}
 */
export const createReadline = (options = undefined) => readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    history: options?.history
});

/**
 * @param {module:readline/promises.Interface} rl
 * @return {module:readline/promises.Interface}
 */
export const pauseReadline = (rl) => rl.pause();

/**
 * @param {module:readline/promises.Interface} rl
 * @return {module:readline/promises.Interface}
 */
export const resumeReadline = (rl) => rl.resume();

/**
 * @param {module:readline/promises.Interface} rl
 * @return {void}
 */
export const closeReadline = (rl) => rl.close();

/**
 * @param {string} prompt
 * @param {module:readline/promises.Interface} rl
 * @return {void}
 */
export const setReadlinePrompt = (prompt, rl) => {
    rl.setPrompt(prompt);
    rl.prompt();
}
