import {createReadline} from '#readline-utils';
import {log} from '#console-utils';
import {IO} from '#fp-utils';
import {initializeCmdShellWith} from '#shell-commander';
import {errorMsg, logDebug, outputMsg} from "#shell-messages";
import ExitCommand from "#shell-commands/exit.js";
import OsCommand from "#shell-commands/os.js";
import {isInstanceOf} from '#common-utils';
import {InvalidInputError, OperationFailedError} from '#shell-errors';
import ListDirectoryCommand from '#shell-commands/ls.js';
import GoToDirectoryCommand from '#shell-commands/cd.js';
import DirectoryUpCommand from '#shell-commands/up.js';
import StreamFileContentCommand from '#shell-commands/file/cat.js';
import CreateFileCommand from '#shell-commands/file/add.js';
import RemoveFileCommand from '#shell-commands/file/rm.js';
import FileHashCommand from '#shell-commands/file/hash.js';
import RenameCommand from '#shell-commands/file/rn.js';

const DEBUG = false;

/** @type {CommandsConfig} */
const cmdConfig = Object.freeze({
    // no arguments commands
    [ExitCommand.command]: {factory: () => new ExitCommand(), description: ExitCommand.description, debug: false},
    [OsCommand.command]: {factory: () => new OsCommand(), description: OsCommand.description, debug: false}, // many options command
    [ListDirectoryCommand.command]: {
        factory: () => new ListDirectoryCommand(),
        description: ListDirectoryCommand.description,
        debug: false
    },
    [DirectoryUpCommand.command]: {
        factory: () => new DirectoryUpCommand(),
        description: DirectoryUpCommand.description,
        debug: false
    },
    // one argument commands
    [GoToDirectoryCommand.command]: {
        factory: () => new GoToDirectoryCommand(),
        description: GoToDirectoryCommand.description,
        debug: false
    },
    [StreamFileContentCommand.command]: {
        factory: () => new StreamFileContentCommand(),
        description: StreamFileContentCommand.description,
        debug: false
    },
    [CreateFileCommand.command]: {
        factory: () => new CreateFileCommand(),
        description: CreateFileCommand.description,
        debug: false
    },
    [RemoveFileCommand.command]: {
        factory: () => new RemoveFileCommand(),
        description: RemoveFileCommand.description,
        debug: false
    },
    [FileHashCommand.command]: {
        factory: () => new FileHashCommand(),
        description: FileHashCommand.description,
        debug: false
    },
    // two arguments commands
    [RenameCommand.command]: {
        factory: () => new RenameCommand(),
        description: FileHashCommand.description,
        debug: false
    },
    // TODO AR two operands (cp|mv|compress|decompress) && args.length === 2
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
        if (err.cause) {
            return log(errorMsg`Operation failed: ${err.cause?.message}`)
        }
        return log(errorMsg`Operation failed: ${err.message}`);
    }

    return log(errorMsg`Error: ${err.message}`)
}

/**
 * @param {CmdOperation} result
 */
const printResult = (result) => {
    if (result.data) {
        log(result.data)
    } else if (result.message) {
        log(result.message)
    }
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
    createReadline({history: Object.keys(cmdConfig).map((cmd) => `${cmd} --help`)}),
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
