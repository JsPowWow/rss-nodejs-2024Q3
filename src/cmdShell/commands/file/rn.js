import {parseInputForHelpOption} from '#shell-utils';
import {Nothing} from '#fp-utils';
import {output2Msg, outputMsg} from '#shell-messages';
import {
    assertFileExistsAsync,
    assertFileNotExistsAsync,
    assertHasExpectedPositionalsNum,
    assertIsFile,
    OperationFailedError
} from '#shell-errors';
import path from 'node:path';
import fs from 'node:fs';

const COMMAND_DESCRIPTION = outputMsg`Rename file (content remains unchanged)`;

const parseInput = parseInputForHelpOption;

/** @implements {Command} */
export default class RenameCommand {
    static command = 'rn';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `RenameCommand::(${RenameCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        const parsedArgs = await parseInput(ctx);

        const {values, positionals} = parsedArgs

        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: {values, positionals}} : Nothing;

        if (values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${RenameCommand.description}`};
        }

        assertHasExpectedPositionalsNum(RenameCommand.command, 2, parsedArgs);

        const srcFilePath = path.resolve(positionals[0]);

        await assertFileExistsAsync(srcFilePath);

        await assertIsFile(srcFilePath);

        const targetFilePath = path.resolve(path.parse(srcFilePath).dir, positionals[1]);

        await assertFileNotExistsAsync(targetFilePath);

        await fs.promises.rename(srcFilePath, targetFilePath).catch(OperationFailedError.reThrowWith)

        yield {
            type: 'success',
            message: ctx.input,
            data: output2Msg`${srcFilePath}  successfully renamed to ${targetFilePath}`
        };
    }
}

