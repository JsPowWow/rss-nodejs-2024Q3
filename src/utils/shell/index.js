import process from 'node:process';
import os from 'node:os';
import {parseArgs} from 'node:util';
import {InvalidInputError} from '#shell-errors';

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
 * @param {string} arg
 * @param {string[]} positionals
 */
export function assertNoExtraPositionals(arg, positionals) {
    const extraPositionals = positionals?.filter((p) => p !== arg) ?? [];
    if (extraPositionals.length > 0) {
        InvalidInputError.throw(`Unknown param(s): ${positionals?.join(" ")}`);
    }
}

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
