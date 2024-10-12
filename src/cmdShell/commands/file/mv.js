import {parseInputForHelpOption} from '#shell-utils';
import {pipeline} from 'node:stream/promises'
import fs from 'node:fs';
import {Nothing} from '#fp-utils';
import {output2Msg, outputMsg} from '#shell-messages';

import {assertFileExistsAsync, assertHasExpectedPositionalsNum, assertIsFile} from '#shell-errors';
import path from 'node:path';


const COMMAND_DESCRIPTION = outputMsg`Move file (same as copy, but initial file is deleted, copying part is done using Readable and Writable streams)`;

const parseInput = parseInputForHelpOption;

/** @implements {Command} */
export default class MoveFileCommand {
    static command = 'mv';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `MoveFileCommand::(${MoveFileCommand.command})`;
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
            return yield {type: 'success', message: ctx.input, data: outputMsg`${MoveFileCommand.description}`};
        }

        assertHasExpectedPositionalsNum(MoveFileCommand.command, 2, parsedArgs);

        const sourceFile = path.resolve(positionals[0]);

        await assertFileExistsAsync(sourceFile);
        await assertIsFile(sourceFile);

        const targetFile = path.resolve(positionals[1], path.parse(sourceFile).base)
        const readableStream = fs.createReadStream(sourceFile)
        const writableStream = fs.createWriteStream(targetFile)
        await pipeline(readableStream, writableStream)

        ctx.debug ? yield {
            type: 'debug',
            message: 'file transferred',
            data: `${sourceFile} -> ${targetFile}`
        } : Nothing;

        await fs.promises.unlink(sourceFile);
        ctx.debug ? yield {type: 'debug', message: 'origin file deleted', data: `${sourceFile}`} : Nothing;

        yield {
            type: 'success',
            message: ctx.input,
            data: output2Msg`${sourceFile}  successfully moved to ${targetFile}`
        };
    }
}

