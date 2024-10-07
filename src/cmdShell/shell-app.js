import {closeReadline, createReadline, setReadlinePrompt} from '#readline-utils';
import {ansi, logText, ttyText} from '#console-utils';
import {IO, pipe, tap} from '#fp-utils';
import {
    changeDir,
    getCLIArgumentsValues,
    getCurrentUserName,
    getCurrentWorkingDir,
    getHomeDir,
    processExit
} from '#shell-utils';
import {commands} from "#shell-commands"

const USERNAME = "username"
const argsMap = getCLIArgumentsValues(USERNAME);

/**
 * @return {string}
 */
const getUserName = () => argsMap[USERNAME] ?? getCurrentUserName(); // TODO AR yellow warning "--username is missing"

/**
 * @param {string} userName
 */
const sayGreetings = userName => logText(
    ttyText("Welcome to the File Manager, ", ansi.blue),
    ttyText(`${userName}`, ansi.brightYellow),
    ttyText("!", ansi.blue));

/**
 * @returns {void}
 */
const logCurrentWorkingDir = () => logText(
    ttyText("You are currently in "),
    ttyText(getCurrentWorkingDir(), ansi.brightGreen));

/**
 * @param {string} userName
 * @returns {void}
 */
const sayGoodByeAndThankYou = userName => logText(
    ansi.eol,
    ttyText("Thank you for using File Manager, ", ansi.blue),
    ttyText(`${userName}`, ansi.brightYellow),
    ttyText(", goodbye!", ansi.blue));


/**
 * @param {module:readline/promises.Interface} shell
 */
const prompt = shell => setReadlinePrompt(`${ansi.brightWhite()}${getCurrentWorkingDir()}> `, shell)

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