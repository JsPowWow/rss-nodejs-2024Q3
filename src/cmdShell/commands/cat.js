import {createReadStream} from 'node:fs'
import path from 'node:path'
import {parseInputForHelpOption} from '#shell-utils';
import {Nothing} from '#fp-utils';
import {output2Msg, outputMsg} from '#shell-messages';
import {OperationFailedError} from '#shell-errors';

const COMMAND_DESCRIPTION = outputMsg`Read file and print it's content in console (it's done using Readable stream)`;

const parseInput = parseInputForHelpOption;

/** @implements {Command} */
export default class CatCommand {
    static command = 'cat';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `CatCommand::(${CatCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        const {values, positionals} = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: {values, positionals}} : Nothing;

        if (values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${CatCommand.description}`};
        }

        const filePath = path.resolve(ctx.input.trimStart().slice(CatCommand.command.length + 1));

        try {
            for await (const chunk of createReadStream(filePath, {encoding: 'utf8'})) {
                yield {type: 'chunk', message: ctx.input, data: output2Msg`${chunk}`};
            }
        } catch (e) {
            OperationFailedError.reThrowWith(e);
        }

        yield {type: 'success', message: ctx.input, data: filePath}
    }
}
