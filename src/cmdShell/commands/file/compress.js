import {parseInputForHelpOption} from '#shell-utils';
import {pipeline} from 'node:stream/promises'
import fs from 'node:fs';
import zlib from 'node:zlib'
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


const COMMAND_DESCRIPTION = outputMsg`Compress file (using Brotli algorithm, done using Streams API)`;

const parseInput = parseInputForHelpOption;

/** @implements {Command} */
export default class CompressFileCommand {
    static command = 'compress';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `CompressFileCommand::(${CompressFileCommand.command})`;
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
            return yield {type: 'success', message: ctx.input, data: outputMsg`${CompressFileCommand.description}`};
        }

        assertHasExpectedPositionalsNum(CompressFileCommand.command, 2, parsedArgs);

        const sourceFile = path.resolve(positionals[0]);

        await assertFileExistsAsync(sourceFile);
        await assertIsFile(sourceFile);

        const targetFile = path.resolve(positionals[1], `${path.parse(sourceFile).base}.compressed`);

        await assertFileNotExistsAsync(targetFile);

        const readableStream = fs.createReadStream(sourceFile)
        const writableStream = fs.createWriteStream(targetFile)
        const compress = zlib.createBrotliCompress()
        await pipeline(readableStream, compress, writableStream).catch(OperationFailedError.reThrowWith)

        ctx.debug ? yield {
            type: 'debug',
            message: 'file compressed',
            data: `${sourceFile} -> ${targetFile}`
        } : Nothing;


        yield {
            type: 'success',
            message: ctx.input,
            data: output2Msg`${sourceFile}  successfully compressed to ${targetFile}`
    };
}
}

