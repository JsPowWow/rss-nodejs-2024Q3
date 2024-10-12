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


const COMMAND_DESCRIPTION = outputMsg`Decompress file (using Brotli algorithm, done using Streams API)`;

const parseInput = parseInputForHelpOption;

/** @implements {Command} */
export default class DeCompressFileCommand {
    static command = 'decompress';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `DeCompressFileCommand::(${DeCompressFileCommand.command})`;
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
            return yield {type: 'success', message: ctx.input, data: outputMsg`${DeCompressFileCommand.description}`};
        }

        assertHasExpectedPositionalsNum(DeCompressFileCommand.command, 2, parsedArgs);

        const sourceFile = path.resolve(positionals[0]);

        await assertFileExistsAsync(sourceFile);
        await assertIsFile(sourceFile);

        if (!path.parse(sourceFile).ext.includes('.compressed')) {
            OperationFailedError.throw(`Expect to have with .compressed extension file provided, but got "${sourceFile}"`)
        }

        const targetFile = path.resolve(positionals[1], path.parse(sourceFile).name);

        await assertFileNotExistsAsync(targetFile);

        const readableStream = fs.createReadStream(sourceFile)
        const writableStream = fs.createWriteStream(targetFile)
        const deCompress = zlib.createBrotliDecompress()
        await pipeline(readableStream, deCompress, writableStream).catch(OperationFailedError.reThrowWith)

        ctx.debug ? yield {
            type: 'debug',
            message: 'file decompressed',
            data: `${sourceFile} -> ${targetFile}`
        } : Nothing;


        yield {
            type: 'success',
            message: ctx.input,
            data: output2Msg`${sourceFile}  successfully decompressed to ${targetFile}`
        };
    }
}

