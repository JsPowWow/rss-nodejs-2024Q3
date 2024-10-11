import path from 'node:path'
import {parseInputForHelpOption} from '#shell-utils';
import {Nothing} from '#fp-utils';
import {output2Msg, outputMsg} from '#shell-messages';
import * as fs from 'node:fs';
import {OperationFailedError} from '#shell-errors';

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
        const {values, positionals} = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: {values, positionals}} : Nothing;

        if (values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${CreateFileCommand.description}`};
        }

        const filePath = path.resolve(ctx.input.trimStart().slice(CreateFileCommand.command.length + 1));

        await fs.promises.writeFile(filePath, "", {flag: 'wx'}).catch(OperationFailedError.reThrowWith);

        yield {type: 'success', message: ctx.input, data: output2Msg`${filePath}  -  successfully created`};
    }
}
