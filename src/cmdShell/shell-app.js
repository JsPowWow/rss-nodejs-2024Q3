import {closeReadline, createReadline, setReadlinePrompt} from '#readline-utils';
import {log, styledMsg} from '#console-utils';
import {IO, pipe, tap} from '#fp-utils';
import {
    changeDir,
    getCmdArgsValues,
    getCurrentUserName,
    getCurrentWorkingDir,
    getHomeDir,
    processExit
} from '#shell-utils';
import {commands} from "#shell-commands"

const USERNAME = "username"
const argsMap = getCmdArgsValues(USERNAME);

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
    log(styledMsg({text: 'blue', values: 'yellowBright'})`\n\nThank you for using File Manager, ${userName}, goodbye!`)
}

/**
 * @param {module:readline/promises.Interface} shell
 */
const prompt = shell => setReadlinePrompt(styledMsg({text: 'whiteBright'})`${getCurrentWorkingDir()}>`, shell) // TODO AR "You are currently in ....

/**
 * @param {module:readline/promises.Interface} shell
 */
const handleCloseIntent = shell => shell.on('SIGINT', IO.pipeWith(shell, closeReadline));

/**
 * @param {module:readline/promises.Interface} shell
 */
const handleClose = shell => shell.on('close', pipe(getUserName, sayGoodByeAndThankYou, processExit(0)));

/**
 * @param {module:readline/promises.Interface} shell
 */
const handleInputLine = shell => {
    return shell.on('line', line => {
        const command = commands[line];
        // TODO AR exec command(s)
        command
            ? console.log(`find - ${command.name}`)
            : console.log(`unknown ${line}`)

        prompt(shell);
    });
};

export const createShell = IO.pipeWith(
    createReadline(),
    tap(pipe(getHomeDir, changeDir)), // go to user home directory
    tap(pipe(getUserName, sayGreetings, logCurrentWorkingDir)), // welcome
    pipe(handleInputLine, handleCloseIntent, handleClose), // shell events subscriptions
    prompt
);