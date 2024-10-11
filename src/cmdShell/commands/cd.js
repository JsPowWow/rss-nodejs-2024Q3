import {chdir} from 'node:process'
import {getCurrentWorkingDir, parseCmdLine, withCmdArgsValues} from '#shell-utils';
import {Nothing, pipeAsync, pipeAsyncWith} from '#fp-utils';
import {assertHasExpectedPositionalsNum, InvalidInputError, OperationFailedError} from '#shell-errors';
import {outputMsg} from '#shell-messages';
import path from 'node:path';

const COMMAND_DESCRIPTION = outputMsg`Go to dedicated folder from current directory (${'path_to_directory'} can be relative or absolute)`;

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
export default class CDCommand {
    static command = 'cd';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `CDCommand::(${CDCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        const {values: args, positionals} = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: {args, positionals}} : Nothing;

        assertHasExpectedPositionalsNum(CDCommand.command, 1, {values: args, positionals});

        if (args['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${CDCommand.description}`};
        }

        await pipeAsync(chdir)(positionals[0]).catch(OperationFailedError.reThrowWith);

        const currentDir = path.resolve(getCurrentWorkingDir());
        ctx.debug ? yield {type: 'debug', message: 'currentDir', data: currentDir} : Nothing;

        return yield {type: 'success', message: ctx.input, data: currentDir};
    }
}
