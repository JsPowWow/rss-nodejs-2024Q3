import {outputMsg} from '#shell-messages';
import {assertNoExtraPositionals, InvalidInputError} from '#shell-errors';
import {parseCmdLine, withCmdArgsValues} from '#shell-utils';
import {Nothing, pipeAsyncWith} from '#fp-utils';

const COMMAND_DESCRIPTION = outputMsg`Exits from the current Node.js process`;

/**
 * @param {CmdExecContext} ctx
 * @returns {Promise<ParsedArgs>}
 */
const parseInput = ctx =>
    pipeAsyncWith(parseCmdLine(ctx.input).slice(1),
        withCmdArgsValues(
            {name: 'help', type: 'boolean', default: false}
        )).catch(InvalidInputError.reThrowWith(ctx.input));

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
        const {values, positionals} = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: values} : Nothing;
        assertNoExtraPositionals(ExitCommand.command, {values, positionals});

        if (values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${ExitCommand.description}`};
        }

        yield {type: 'debug', message: 'request close'};

        const answer = yield {type: 'systemAction', message: 'request close', data: 'terminate'};
        yield {type: 'noop', message: 'noop'};

        yield {type: 'success', message: 'done', data: outputMsg`${answer}`};
    }
}
