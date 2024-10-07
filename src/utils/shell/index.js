import process from 'node:process';
import os from 'node:os';

/**
 * @param {number} code
 * @return {() => never}
 */
export const processExit = code => () => process.exit(code);

/**
 * @param {string} argName
 * @return {string | undefined}
 */
export const getCLIArgValue = (argName) =>
    process.argv.slice(2)
        .find((arg) => arg.startsWith(argName))
        ?.split("=")
        [1];

/**
 * @return {string}
 */
export const getCurrentWorkingDir = () => process.cwd();

/**
 * @return {string}
 */
export const getCurrentUserName = () => os.userInfo().username;

/**
 * @return {string}
 */
export const getHomeDir = () => os.userInfo().homedir;

/**
 * @param {string} dir
 * @return {void}
 */
export const changeDir = (dir) => process.chdir(dir);
