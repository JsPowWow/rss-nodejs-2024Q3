import {createReadline} from '#readline-utils';
import {log} from '#console-utils';
import {IO} from '#fp-utils';
import {initializeCmdShellWith} from '#shell-commander';
import {errorMsg, logDebug, outputMsg} from "#shell-messages";
import ExitCommand from "#shell-commands/exit.js";
import OsCommand from "#shell-commands/os.js";
import {isInstanceOf} from '#common-utils';
import {InvalidInputError, OperationFailedError} from '#shell-errors';
import LSCommand from '#shell-commands/ls.js';

const DEBUG = false;

/** @type {CommandsConfig} */
const cmdConfig = Object.freeze({
    [ExitCommand.command]: {factory: () => new ExitCommand(), description: ExitCommand.description, debug: false},
    [OsCommand.command]: {factory: () => new OsCommand(), description: OsCommand.description, debug: false},
    [LSCommand.command]: {factory: () => new LSCommand(), description: LSCommand.description, debug: false},
});

/**
 * @param {string} userName
 * @returns {void}
 */
const sayGreetings = userName => {
    log(outputMsg`Welcome to the File Manager, ${userName}!`);
}

/**
 * @param {string} userName
 * @returns {void}
 */
const sayGoodByeAndThankYou = userName => {
    log(outputMsg`\nThank you for using File Manager, ${userName}, goodbye!`)
}

/**
 * @param {Error | InvalidInputError} err
 */
const printError = (err) => {
    if (isInstanceOf(InvalidInputError, err)) {
        return log(errorMsg`Invalid input: ${err.input} ${err.cause?.message}`)
    }
    if (isInstanceOf(OperationFailedError, err)) {
        return log(errorMsg`Operation failed: ${err.cause?.message}`)
    }

    return log(errorMsg`Error: ${err.message}`)
}

/**
 * @param {CmdOperation} result
 */
const printResult = (result) => {
    log(result.data ? result.data : result.message);
}

/**
 * @param {CmdOperation} result
 */
const printDebug = (result) => {
    if (result.data) {
        return logDebug(result.message, result.data)
    }
    return logDebug(result.message);
}

export const createShell = IO.pipeWith(
    createReadline(),
    initializeCmdShellWith({
        commandsConfig: cmdConfig,
        onStart: sayGreetings,
        onClose: sayGoodByeAndThankYou,
        onResult: printResult,
        onError: printError,
        debug: DEBUG,
        onDebug: printDebug
    })
);
