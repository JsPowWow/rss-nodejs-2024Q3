import process from 'node:process';
import os from 'node:os';
import {parseArgs} from 'node:util';

/**
 * @param {number} code
 * @return {() => never}
 */
export const processExit = code => () => process.exit(code);

/**
 * @param {...string} argNames
 * @return {object}
 */
export const getCLIArgumentsValues = (...argNames) =>
    parseArgs({
        strict: false,
        args: process.argv.slice(2),
        options: Object.fromEntries(argNames.map((a) => ([[a], {type: 'string',default: '', }])))
    }).values;

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
