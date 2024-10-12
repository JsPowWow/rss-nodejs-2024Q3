import {parseInputForHelpOption} from '#shell-utils';
import {pipeline} from 'node:stream/promises'
import fs from 'node:fs';
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


const COMMAND_DESCRIPTION = outputMsg`Copy file (It's done using Readable and Writable streams)`;

const parseInput = parseInputForHelpOption;

/** @implements {Command} */
export default class CopyFileCommand {
    static command = 'cp';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `CopyFileCommand::(${CopyFileCommand.command})`;
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
            return yield {type: 'success', message: ctx.input, data: outputMsg`${CopyFileCommand.description}`};
        }

        assertHasExpectedPositionalsNum(CopyFileCommand.command, 2, parsedArgs);

        const srcFilePath = path.resolve(positionals[0]);

        await assertFileExistsAsync(srcFilePath);
        await assertIsFile(srcFilePath);

        const targetFilePath = path.resolve(positionals[1], path.parse(srcFilePath).base)

        await assertFileNotExistsAsync(targetFilePath);

        const readableStream = fs.createReadStream(srcFilePath)
        const writableStream = fs.createWriteStream(targetFilePath)
        await pipeline(readableStream, writableStream).catch(OperationFailedError.reThrowWith)

        yield {
            type: 'success',
            message: ctx.input,
            data: output2Msg`${srcFilePath}  successfully copied to ${targetFilePath}`
        };
    }
}

