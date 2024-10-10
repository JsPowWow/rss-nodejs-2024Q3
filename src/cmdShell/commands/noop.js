import {outputMsg} from '#shell-messages';

const COMMAND_DESCRIPTION = outputMsg`No-operation command`;

/**
 * @implements {Command}
 */
class NoopCommand {
    static command = '.noop';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `NoopCommand::(${NoopCommand.command})`;
    }

    /**
     * @param {CmdExecContext} _ctx
     * @returns {AsyncGenerator<CmdResult, void, *>}
     */
    async* execute(_ctx) {
        yield {type: 'debug', message: 'noop command in action'};
    }
}

/** @type {Command} **/
export const noopCommand = new NoopCommand();
