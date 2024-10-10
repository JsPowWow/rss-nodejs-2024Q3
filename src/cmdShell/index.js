import {createReadline} from '#readline-utils';
import {log} from '#console-utils';
import {IO} from '#fp-utils';
import {initializeCmdShellWith} from '#shell-commander';
import {errorMsg, outputMsg} from "#shell-messages";
import ExitCommand from "#shell-commands/exit.js";
import OsCommand from "#shell-commands/os.js";
import {isInstanceOf} from '#common-utils';
import {InvalidInputError} from '#shell-errors';

const DEBUG = false;

/** @type {CommandsConfig} */
const cmdConfig = Object.freeze({
    [ExitCommand.command]: {factory: () => new ExitCommand(), description: ExitCommand.description},
    [OsCommand.command]: {factory: () => new OsCommand(), description: OsCommand.description}
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
    return log(errorMsg`Error: ${err.message}`)
}


export const createShell = IO.pipeWith(
    createReadline(),
    initializeCmdShellWith({
        commandsConfig: cmdConfig,
        onStart: sayGreetings,
        onClose: sayGoodByeAndThankYou,
        onError: printError,
        debug: DEBUG
    })
);