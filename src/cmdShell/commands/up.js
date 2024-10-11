import {chdir} from 'node:process'
import {getCurrentWorkingDir, parseCmdLine, withCmdArgsValues} from '#shell-utils';
import {Nothing, pipeAsync, pipeAsyncWith} from '#fp-utils';
import {assertNoExtraPositionals, InvalidInputError, OperationFailedError} from '#shell-errors';
import {outputMsg} from '#shell-messages';
import path from 'node:path';

const COMMAND_DESCRIPTION = outputMsg`Go upper from current directory`;

/**
 * @param {CmdExecContext} ctx
 * @returns {Promise<ParsedArgs>}
 */
const parseInput = ctx =>
    pipeAsyncWith(parseCmdLine(ctx.input).slice(1),
        withCmdArgsValues(
            {name: 'help', type: 'boolean', default: false}
        )).catch(InvalidInputError.reThrowWith(ctx.input));

/** @implements {Command} */
export default class UPCommand {
    static command = 'up';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `UPCommand::(${UPCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        const {values, positionals} = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: {values, positionals}} : Nothing;

        assertNoExtraPositionals(UPCommand.command, {values, positionals});

        if (values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${UPCommand.description}`};
        }

        await pipeAsync(chdir)("..").catch(OperationFailedError.reThrowWith);

        const currentDir = path.resolve(getCurrentWorkingDir());
        ctx.debug ? yield {type: 'debug', message: 'currentDir', data: currentDir} : Nothing;

        return yield {type: 'success', message: ctx.input, data: currentDir};
    }
}
