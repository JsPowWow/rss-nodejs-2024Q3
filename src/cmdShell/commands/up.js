import {chdir} from 'node:process'
import {getCurrentWorkingDir, parseInputForHelpOption} from '#shell-utils';
import {Nothing, pipeAsync} from '#fp-utils';
import {assertNoExtraPositionals, OperationFailedError} from '#shell-errors';
import {outputMsg} from '#shell-messages';
import path from 'node:path';

const COMMAND_DESCRIPTION = outputMsg`Go upper from current directory`;

const parseInput = parseInputForHelpOption;

/** @implements {Command} */
export default class DirectoryUpCommand {
    static command = 'up';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `UPCommand::(${DirectoryUpCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        const {values, positionals} = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: {values, positionals}} : Nothing;

        assertNoExtraPositionals(DirectoryUpCommand.command, {values, positionals});

        if (values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${DirectoryUpCommand.description}`};
        }

        await pipeAsync(chdir)("..").catch(OperationFailedError.reThrowWith);

        const currentDir = path.resolve(getCurrentWorkingDir());
        ctx.debug ? yield {type: 'debug', message: 'currentDir', data: currentDir} : Nothing;

        return yield {type: 'success'};
    }
}
