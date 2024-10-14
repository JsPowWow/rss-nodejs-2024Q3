import {IO} from '#fp-utils';
import {createReadline} from '#readline-utils';
import {initializeCmdShellWith} from '#shell-commander';
import {commandsConfig} from '#shell-config';
import {errorMsg, logDebug, outputMsg} from '#shell-messages';
import {log} from '#console-utils';
import {isInstanceOf} from '#common-utils';
import {InvalidInputError, OperationFailedError} from '#shell-errors';


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
 * @param {Error} err
 */
const printError = (err) => {
    if (isInstanceOf(InvalidInputError, err)) {
        return log(errorMsg`Invalid input: ${err['input']} ${err.cause?.message}`)
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

const DEBUG = false;

export const createShell = IO.pipeWith(
    createReadline({history: Object.keys(commandsConfig).map((cmd) => `${cmd} --help`)}),
    initializeCmdShellWith({
        commandsConfig: commandsConfig,
        onStart: sayGreetings,
        onClose: sayGoodByeAndThankYou,
        onResult: printResult,
        onError: printError,
        debug: DEBUG,
        onDebug: printDebug
    })
);

createShell();
