import fs from 'node:fs'
import path from 'node:path'
import {parseInputForHelpOption} from '#shell-utils';
import {Nothing} from '#fp-utils';
import {output2Msg, outputMsg} from '#shell-messages';
import {OperationFailedError} from '#shell-errors';

const COMMAND_DESCRIPTION = outputMsg`Delete file`;

const parseInput = parseInputForHelpOption;

/** @implements {Command} */
export default class RemoveFileCommand {
    static command = 'rm';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `RmCommand::(${RemoveFileCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        const {values, positionals} = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: {values, positionals}} : Nothing;

        if (values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${RemoveFileCommand.description}`};
        }

        const filePath = path.resolve(ctx.input.trimStart().slice(RemoveFileCommand.command.length + 1));

        await fs.promises.unlink(filePath).catch(OperationFailedError.reThrowWith);

        yield {type: 'success', message: ctx.input, data: output2Msg`${filePath}  -  successfully deleted`};
    }
}
