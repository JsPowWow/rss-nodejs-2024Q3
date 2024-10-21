import path from 'node:path'
import fs from 'node:fs/promises';
import {parseInputForHelpOption} from '#shell-utils';
import {Nothing} from '#fp-utils';
import {output2Msg, outputMsg} from '#shell-messages';
import {
    assertHasExpectedPositionalsNum,
    assertIsFileSomewhereInCurrentWorkDirectory,
    OperationFailedError
} from '#shell-errors';


const COMMAND_DESCRIPTION = outputMsg`Create empty file in current working directory`;

const parseInput = parseInputForHelpOption;

/** @implements {Command} */
export default class CreateFileCommand {
    static command = 'add';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `AddCommand::(${CreateFileCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        const parsedArgs = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: parsedArgs} : Nothing;

        if (parsedArgs.values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${CreateFileCommand.description}`};
        }

        assertHasExpectedPositionalsNum(CreateFileCommand.command, 1, parsedArgs);

        const filePath = path.resolve(parsedArgs.positionals[0]);

        ctx.debug ? yield {type: 'debug', message: 'filepath', data: `${filePath}`} : Nothing;

        assertIsFileSomewhereInCurrentWorkDirectory(filePath);

        await fs.writeFile(filePath, "", {flag: 'wx'}).catch(OperationFailedError.reThrowWith);

        yield {type: 'success', message: ctx.input, data: output2Msg`${filePath}  -  successfully created`};
    }
}
