import {chdir} from 'node:process'
import {getCurrentWorkingDir, parseInputForHelpOption} from '#shell-utils';
import {Nothing, pipeAsync} from '#fp-utils';
import {OperationFailedError} from '#shell-errors';
import {outputMsg} from '#shell-messages';
import path from 'node:path';

const COMMAND_DESCRIPTION = outputMsg`Go to dedicated folder from current directory (${'path_to_directory'} can be relative or absolute)`;

const parseInput = parseInputForHelpOption;

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
        const {values, positionals} = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: {values, positionals}} : Nothing;

        if (values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${CDCommand.description}`};
        }

        const newDirPath = ctx.input.trimStart().slice(CDCommand.command.length + 1);

        await pipeAsync(chdir)(newDirPath).catch(OperationFailedError.reThrowWith);

        const currentDir = path.resolve(getCurrentWorkingDir());
        ctx.debug ? yield {type: 'debug', message: 'currentDir', data: currentDir} : Nothing;

        return yield {type: 'success', message: ctx.input, data: currentDir};
    }
}
