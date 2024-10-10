import {outputMsg} from '#shell-messages';

const COMMAND_DESCRIPTION = outputMsg`Exits from the current Node.js process`;

/**
 * @implements {Command}
 */
export default class ExitCommand {
    static command = '.exit';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `ExitCommand::(${ExitCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdResult, void, *>}
     */
    async* execute(ctx) {
        ctx.rl.close();
        yield {type: 'debug', message: 'finished'};
    }
}
