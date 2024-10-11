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
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        yield {type: 'debug', message: 'request close'};

        const answer = yield {type: 'systemAction', message: 'request close', data: 'terminate'};
        yield {type: 'noop', message: 'noop'};

        yield {type: 'success', message: 'done', data: outputMsg`${answer}`};
    }
}
