import {closeReadline, pauseReadline, resumeReadline, setReadlinePrompt} from '#readline-utils';
import {IO, isFn, Maybe, pipe, pipeAsyncWith, tap} from '#fp-utils';
import {InvalidInputError} from '#shell-errors';
import {noopCommand} from '#shell-commands/noop.js';
import {logCurrentWorkingDir, shellPromptMsg} from '#shell-messages';
import {identity} from '#common-utils';
import {changeDir, getCurrentWorkingDir, getHomeDir, parseCmdLine, processExit} from '#shell-utils';
import Bootstrap from './bootstrap.js';

const bootstrap = new Bootstrap();

/**
 * @param {module:readline/promises.Interface} rl
 */
const readlinePrompt = rl => setReadlinePrompt(shellPromptMsg`${getCurrentWorkingDir()}>`, rl);

/**
 * @param {module:readline/promises.Interface} rl
 */
const handleCloseIntent = rl => rl.on('SIGINT', IO.pipeWith(rl, closeReadline));

/**
 * @param {object} options
 * @param {module:readline/promises.Interface} options.readline
 * @param {string} options.inputString
 * @param {boolean} [options.debug]
 * @returns {CmdExecContext}
 */
const createCommandContext = options => {
    return {
        rl: options.readline,
        input: options.inputString,
        debug: Boolean(options.debug)
    };
};

/**
 * @param {CommandsConfig} config
 * @returns {function(CmdExecContext): [Command, CmdExecContext]}
 */
const findConfigurableCommand = config => ctx =>
    [Maybe.of(Object
        .entries(config)
        .find(([key, cmd]) => cmd && parseCmdLine(ctx.input.trim()).filter(Boolean)[0] === key)?.[1]?.factory).matchWith({
        some: factory => factory(),
        nothing: () => ctx.input.trim()
            ? InvalidInputError.throw(ctx.input)
            : noopCommand
    }), ctx];

/**
 * @param {CommanderOptions} options
 * @returns {function([Command,CmdExecContext]):Promise<void>}
 */
const executeCommand = (options) => async ([command, ctx]) => {
    const {debug = false} = ctx;
    if (!command) {
        InvalidInputError.throw(ctx.input);
    }
    for await (const cmdOutput of command.execute(ctx)) {
        const {type} = cmdOutput;

        if (debug && type === 'debug' && isFn(options.onDebug)) {
            options.onDebug(cmdOutput);
        }

        if (type === 'success') {
            options.onResult(cmdOutput);
        }
    }
};

/**
 * @param {CommanderOptions} options
 * @returns {function(module:readline/promises.Interface): module:readline/promises.Interface}
 */
const handleInputLineWith = options => rl => {
    return rl.on('line', input =>
        pipeAsyncWith(createCommandContext({
                readline: rl,
                inputString: input,
                debug: Boolean(options.debug)
            }),
            // TODO AR - add command execTimeTracking
            tap(() => pauseReadline(rl)),
            findConfigurableCommand(options.commandsConfig), executeCommand(options))
            .catch(options.onError)
            .finally(IO.pipeWith(rl, resumeReadline, tap(logCurrentWorkingDir), readlinePrompt)));
};

/**
 * @param {CommanderOptions} options
 * @returns {function(module:readline/promises.Interface): module:readline/promises.Interface}
 */
const handleCloseWith = options => rl => rl.on('close', pipe(bootstrap.getUserName, options.onClose ?? identity, processExit(0)));

/**
 * @param {CommanderOptions} options
 * @returns {function(module:readline/promises.Interface): module:readline/promises.Interface}
 */
export const initializeCmdShellWith = options => pipe(
    tap(pipe(getHomeDir, changeDir)), // go to user home directory
    tap(pipe(bootstrap.getUserName, options.onStart ?? identity, logCurrentWorkingDir)), // process bootstrap phase
    handleInputLineWith(options), handleCloseIntent, handleCloseWith(options), // subscribe readline events
    readlinePrompt // shell start
);
