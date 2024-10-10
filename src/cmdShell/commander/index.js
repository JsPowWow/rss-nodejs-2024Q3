import process from 'node:process';
import {closeReadline, pauseReadline, resumeReadline, setReadlinePrompt} from '#readline-utils';
import {IO, Maybe, pipe, pipeAsyncWith, tap} from '#fp-utils';
import {InvalidInputError} from '#shell-errors';
import {noopCommand} from '#shell-commands/noop.js';
import {logCurrentWorkingDir, logDebug, shellPromptMsg} from '#shell-messages';
import {log} from '#console-utils';
import {identity} from '#common-utils';
import {
    changeDir,
    getCurrentUserName,
    getCurrentWorkingDir,
    getHomeDir,
    processExit,
    withCmdArgsValues
} from '#shell-utils';


const ARG_USERNAME = "username"
// TODO AR - https://discord.com/channels/755676888680366081/1293278869100560435/1293600577179353098
// TODO AR - move it /cmdShell/bootstrap
const argsMap = withCmdArgsValues({name: ARG_USERNAME, type: 'string', default: ''})(process.argv.slice(2));


/**
 * @return {string}
 */
const getUserName = () => argsMap[ARG_USERNAME] ?? getCurrentUserName(); // TODO AR yellow warning "--username is missing"

/**
 * @param {module:readline/promises.Interface} rl
 */
const readlinePrompt = rl => setReadlinePrompt(shellPromptMsg`${getCurrentWorkingDir()}>`, rl) // TODO AR "You are currently in ....

/**
 * @param {module:readline/promises.Interface} rl
 */
const handleCloseIntent = rl => rl.on('SIGINT', IO.pipeWith(rl, closeReadline));

/**
 * @param {object} options
 * @param {module:readline/promises.Interface} options.readline
 * @param {string} options.inputString
 * @param {CmdExecContext['output']} options.output
 * @param {Command} [options.command]
 * @param {boolean} [options.debug]
 * @returns {CmdExecContext}
 */
const createCommandContext = (options) => {
    return {
        rl: options.readline,
        input: options.inputString,
        output: options.output,
        command: options.command ?? noopCommand,
        debug: options.debug ?? false
    }
}

/**
 * @param {CommandsConfig} config
 * @returns {function(CmdExecContext): CmdExecContext}
 */
const getCommand = (config) => (ctx) =>
    Object.assign(ctx, {
        command: Maybe.of(Object
            .entries(config)
            .find(([key, command]) => command && ctx.input.trim().startsWith(key))?.[1]?.factory).matchWith({
            some: (factory) => factory(),
            nothing: () => ctx.input.trim()
                ? InvalidInputError.throw(ctx.input)
                : noopCommand
        })
    });

/**
 * @param {CmdExecContext} ctx
 * @returns {Promise<void>}
 */
const executeCommand = async (ctx) => {
    const {command, debug = false,} = ctx
    if (!command) {
        InvalidInputError.throw(ctx.input);
    }
    for await (const cmdOutput of command.execute(ctx)) {
        const {type, message, data} = cmdOutput;
        debug && type === 'debug' && data
            ? logDebug(message, data)
            : logDebug(message)
    }
}

/**
 * @param {CommanderOptions} options
 * @returns {function(module:readline/promises.Interface): module:readline/promises.Interface}
 */
const handleInputLineWith = (options) => (rl) => {
    return rl.on('line', input =>
        pipeAsyncWith(createCommandContext({
                readline: rl,
                inputString: input,
                output: log,
                debug: Boolean(options.debug)
            }),
            // TODO AR - add command execTimeTracking
            tap(() => pauseReadline(rl)),
            getCommand(options.commandsConfig), executeCommand)
            .catch(options.onError)
            .finally(IO.pipeWith(rl, resumeReadline, readlinePrompt)));
};

/**
 * @param {CommanderOptions} options
 * @returns {function(module:readline/promises.Interface): module:readline/promises.Interface}
 */
const handleCloseWith = (options) => rl => rl.on('close', pipe(getUserName, options.onClose ?? identity, processExit(0)));

/**
 * @param {CommanderOptions} options
 * @returns {function(module:readline/promises.Interface): module:readline/promises.Interface}
 */
export const initializeCmdShellWith = (options) => pipe(
    tap(pipe(getHomeDir, changeDir)), // go to user home directory
    tap(pipe(getUserName, options.onStart ?? identity, logCurrentWorkingDir)), // process bootstrap phase
    handleInputLineWith(options), handleCloseIntent, handleCloseWith(options), // subscribe readline events
    readlinePrompt // shell start
);