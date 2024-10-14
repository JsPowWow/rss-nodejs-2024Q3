import {chdir} from 'node:process'
import {getCurrentWorkingDir, parseInputForHelpOption} from '#shell-utils';
import {Nothing, pipeAsync} from '#fp-utils';
import {assertHasExpectedPositionalsNum, OperationFailedError} from '#shell-errors';
import {outputMsg} from '#shell-messages';
import path from 'node:path';

const COMMAND_DESCRIPTION = outputMsg`Go to dedicated folder from current directory (${'path_to_directory'} can be relative or absolute)`;

const parseInput = parseInputForHelpOption;

/**
 * @param {string} path
 * @return {string}
 */
const getAsDirectory = (path) => path.endsWith("/") || path.endsWith("\\") ? path : `${path}/`

/** @implements {Command} */
export default class GoToDirectoryCommand {
    static command = 'cd';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `CDCommand::(${GoToDirectoryCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        const parsedArgs = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: parsedArgs} : Nothing;

        if (parsedArgs.values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${GoToDirectoryCommand.description}`};
        }
        assertHasExpectedPositionalsNum(GoToDirectoryCommand.command, 1, parsedArgs);

        const newDirPath = path.resolve(getAsDirectory(parsedArgs.positionals[0]));

        await pipeAsync(chdir)(newDirPath).catch(OperationFailedError.reThrowWith);

        const currentDir = path.resolve(getCurrentWorkingDir());
        ctx.debug ? yield {type: 'debug', message: 'currentDir', data: currentDir} : Nothing;

        return yield {type: 'success'};
    }
}
