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
 * @param {string} options.inputString
 * @param {boolean} [options.debug]
 * @returns {CmdExecContext}
 */
const createCommandContext = options => {
    return {
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
        .find(([key, cmd]) => cmd && parseCmdLine(ctx.input.trim()).filter(Boolean)[0] === key)?.[1]).matchWith({
        some: ({factory, debug = false}) => {
            Object.assign(ctx, {debug: ctx.debug || Boolean(debug)})
            return factory();
        },
        nothing: () => ctx.input.trim()
            ? InvalidInputError.throw(ctx.input)
            : noopCommand
    }), ctx];

/**
 * @param {CommanderOptions & {
 *      rl: module:readline/promises.Interface;
 *      cmdOutput: CmdOperation;
 *  }} options
 * @returns {*}
 */
const processCommandActionsRequest = (options) => {
    const {type, data} = options.cmdOutput;
    if (type === 'systemAction' && data === 'terminate') {
        if (options.debug) {
            setTimeout(() => options.rl.close());
            return 'Will Close'
        }
        options.rl.close();
        return 'Close';
    }
};

/**
 * @param {CommanderOptions & {rl: module:readline/promises.Interface}} options
 * @returns {function([Command,CmdExecContext]):Promise<void>}
 */
const executeCommand = (options) => async ([command, ctx]) => {
    const {debug = false} = ctx;
    if (!command) {
        InvalidInputError.throw(ctx.input);
    }

    const iterator = command.execute(ctx);

    for await (const cmdOutput of iterator) {
        const {type} = cmdOutput;

        switch (type) {
            case 'debug': {
                debug && isFn(options.onDebug) && options.onDebug(cmdOutput);
                break;
            }
            case 'systemAction': {
                await iterator.next(processCommandActionsRequest({...options, cmdOutput, debug}));
                break;
            }
            case 'success': {
                options.onResult(cmdOutput);
                break;
            }
        }
    }
};

/**
 * @param {CommanderOptions} options
 * @returns {function(module:readline/promises.Interface): module:readline/promises.Interface}
 */
const handleInputLineWith = options => rl => {
    return rl.on('line', inputString =>
        pipeAsyncWith(createCommandContext({inputString, debug: Boolean(options.debug)}),
            tap(() => pauseReadline(rl)),
            findConfigurableCommand(options.commandsConfig), executeCommand({...options, rl}))
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
