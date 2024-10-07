import readline from 'node:readline/promises';

/**
 * @return {module:readline/promises.Interface}
 */
export const createReadline = () => readline.createInterface({input: process.stdin, output: process.stdout});

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
