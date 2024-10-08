import {closeReadline, createReadline, resumeReadline, setReadlinePrompt} from '#readline-utils';
import {log, styledMsg} from '#console-utils';
import {IO, pipe, pipeAsyncWith, tap} from '#fp-utils';
import {
    changeDir,
    getCmdArgsValues,
    getCurrentUserName,
    getCurrentWorkingDir,
    getHomeDir,
    processExit
} from '#shell-utils';
import {executeCommand, findMatchCommand, readlinePause} from '#shell-command-utils';
import {commands} from '#shell-commands';
import {isInstanceOf} from '#common-utils';
import {InvalidInputError} from '#errors';
import process from 'node:process';

const USERNAME = "username"
const argsMap = getCmdArgsValues({name: USERNAME, type: 'string', default: ''})(process.argv.slice(2));

/**
 * @return {string}
 */
const getUserName = () => argsMap[USERNAME] ?? getCurrentUserName(); // TODO AR yellow warning "--username is missing"

/**
 * @param {string} userName
 * @returns {void}
 */
const sayGreetings = userName => {
    log(styledMsg({text: 'blue', values: 'yellowBright'})`Welcome to the File Manager, ${userName}!`);
}


/**
 * @returns {void}
 */
const logCurrentWorkingDir = () => {
    log(styledMsg({text: 'gray', values: ['yellowBright', 'italic']})`You are currently in ${getCurrentWorkingDir()}!`)
}

/**
 * @param {string} userName
 * @returns {void}
 */
const sayGoodByeAndThankYou = userName => {
    log(styledMsg({text: 'blue', values: 'yellowBright'})`\nThank you for using File Manager, ${userName}, goodbye!`)
}

/**
 * @param {unknown} err
 */
const printError = (err) => {
    if (isInstanceOf(InvalidInputError, err)) {
        return log(styledMsg({text: 'red', values: 'yellowBright'})`Invalid input: ${err.input} ${err.cause?.message}`)
    }
    return log(styledMsg({text: 'red', values: 'yellowBright'})`Error: ${err.message}`)
}

/**
 * @param {CmdResult} res
 */
const printCommandResult = (res) => {
    if (Array.isArray(res.message)) {
        return log(res.message.join("\n"))
    }
    return log(res.message);
}

/**
 * @param {module:readline/promises.Interface} rl
 */
const prompt = rl => setReadlinePrompt(styledMsg({text: 'whiteBright'})`${getCurrentWorkingDir()}>`, rl) // TODO AR "You are currently in ....

/**
 * @param {module:readline/promises.Interface} rl
 */
const handleCloseIntent = rl => rl.on('SIGINT', IO.pipeWith(rl, closeReadline));

/**
 * @param {module:readline/promises.Interface} rl
 */
const handleClose = rl => rl.on('close', pipe(getUserName, sayGoodByeAndThankYou, processExit(0)));

/**
 * @param {module:readline/promises.Interface} rl
 */
const handleInputLine = (rl) => {
    return rl.on('line', input =>
        input ? pipeAsyncWith({rl, input},
            readlinePause, findMatchCommand(commands), executeCommand)
            .then(printCommandResult)
            .catch(printError)
            .finally(IO.pipeWith(rl, resumeReadline, prompt)) : prompt(rl));
};

export const createShell = IO.pipeWith(
    createReadline(),
    tap(pipe(getHomeDir, changeDir)), // go to user home directory
    tap(pipe(getUserName, sayGreetings, logCurrentWorkingDir)), // welcome
    pipe(handleInputLine, handleCloseIntent, handleClose), // rl events subscriptions
    prompt
);