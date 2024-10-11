import {stat} from 'node:fs/promises'
import {resolve} from 'node:path'
import process from 'node:process';
import os from 'node:os';
import {parseArgs} from 'node:util';
import {pipeAsyncWith} from '#fp-utils';
import {InvalidInputError} from '#shell-errors';
import {stubFalse} from '#common-utils';

/**
 * @param {number} code
 * @return {() => never}
 */
export const processExit = code => () => process.exit(code);

/**
 * @param {...{name: string, type: 'string' | 'boolean', default: *}} argsOptions
 * @return {function(string[]): ParsedArgs}
 */
export const withCmdArgsValues = (...argsOptions) => (args) => {
    const {values, positionals, tokens} = parseArgs({
        args,
        strict: true,
        allowPositionals: true,
        options: Object.fromEntries(argsOptions
            .map((arg, i) => ([[arg.name], argsOptions[i]])))
    });

    return {
        values,
        positionals: positionals.filter(Boolean),
        tokens
    }
};

/**
 * @param {CmdExecContext} ctx
 * @returns {Promise<ParsedArgs>}
 */
export const parseInputForHelpOption = ctx =>
    pipeAsyncWith(parseCmdLine(ctx.input).slice(1),
        withCmdArgsValues(
            {name: 'help', type: 'boolean', default: false}
        )).catch(InvalidInputError.reThrowWith(ctx.input));

/**
 * @param {string} input
 * @returns {string[]}
 */
export const parseCmdLine = (input) => {
    const args = [];
    let readingPart = false;
    let part = '';
    for (let i = 0; i < input.length; i++) {
        if (input.charAt(i) === ' ' && !readingPart) {
            args.push(part);
            part = '';
        } else {
            if (input.charAt(i) === '"') {
                readingPart = !readingPart;
            } else {
                part += input.charAt(i);
            }
        }
    }
    args.push(part);
    return args;
}

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

/**
 * @param {string} path
 * @return {Promise<boolean>}
 */
export const isFileAsync = async (path) => {
    try {
        const stats = await stat(resolve(path)).catch(stubFalse)
        return stats.isFile();
    } catch (error) {
        return false
    }
}

/**
 * @param {string} path
 * @return {Promise<boolean>}
 */
export const isDirectoryAsync = async (path) => {
    try {
        const stats = await stat(resolve(path))
        return stats.isDirectory();
    } catch (error) {
        return false
    }
}
