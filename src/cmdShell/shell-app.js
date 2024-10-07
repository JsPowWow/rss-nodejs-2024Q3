import {closeReadline, createReadline, setReadlinePrompt} from '#readline-utils';
import {ansi, logText, ttyText} from '#console-utils';
import {IO, pipe, tap} from '#fp-utils';
import {
    changeDir,
    getCLIArgValue,
    getCurrentUserName,
    getCurrentWorkingDir,
    getHomeDir,
    processExit
} from '#shell-utils';

/**
 * @return {string}
 */
const getUserName = () => getCLIArgValue("--username") ?? getCurrentUserName();

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


const prompt = (rl)=> setReadlinePrompt(`${getCurrentWorkingDir()}> `, rl)

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
        console.log(`got - ${line}`);
    });
};

export const createShell = IO.pipeWith(
    createReadline(),
    tap(pipe(getHomeDir, changeDir)), // go to user home directory
    tap(pipe(getUserName, sayGreetings, logCurrentWorkingDir)), // welcome
    pipe(handleInputLine, handleCloseIntent, handleClose), // shell events subscriptions
    prompt
);
