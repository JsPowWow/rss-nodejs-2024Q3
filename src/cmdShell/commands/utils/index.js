import {pauseReadline} from '#readline-utils';
import {tap} from '#fp-utils';
import {InvalidInputError} from '#errors';

/**
 * @param {Command} command
 * @param {string} input
 * @returns {boolean}
 */
export const isCmdLineInputOf = (command, input) => {
    return input.trim().startsWith(command.cmd);
}

/**
 * @param {CommandsConfig} config
 * @returns {function(CmdExecContext): CmdExecContext}
 */
export const findMatchCommand = (config) => tap((ctx) => {
    Object.assign(ctx, {
        command: Object
            .entries(config)
            .find(([_key, command]) => command && command.isCommandOf(ctx.input.trim()))?.[1]
    })
})

/** @type {function(CmdExecContext): Promise<CmdResult>} */
export const executeCommand = async (ctx) => {
    const {command} = ctx
    if (!command) {
        InvalidInputError.throw(ctx.input);
    }
    return command.execute(ctx);
}

/**
 * @param {CmdExecContext} ctx
 * @returns {CmdExecContext}
 */
export const readlinePause = (ctx) => {
    pauseReadline(ctx.rl)
    return ctx;
}