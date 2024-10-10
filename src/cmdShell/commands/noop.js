import {outputMsg} from '#shell-messages';

const COMMAND_DESCRIPTION = outputMsg`No-operation command`;

/**
 * @implements {Command}
 */
class NoopCommand {
    static command = '.noop';

    static description = COMMAND_DESCRIPTION;

    /**
     * @param {CmdExecContext} _ctx
     * @returns {AsyncGenerator<CmdResult, void, *>}
     */
    async* execute(_ctx) {
        yield {type: 'debug', message: 'noop command in action'};
    }

    get [Symbol.toStringTag]() {
        return 'NoopCommand::(no-operation)';
    }
}

/** @type {Command} **/
export const noopCommand = new NoopCommand();
