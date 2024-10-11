import path from 'node:path'
import {parseInputForHelpOption} from '#shell-utils';
import {Nothing} from '#fp-utils';
import {outputMsg} from '#shell-messages';
import * as fs from 'node:fs';
import {OperationFailedError} from '#shell-errors';

const COMMAND_DESCRIPTION = outputMsg`Create empty file in current working directory`;

const parseInput = parseInputForHelpOption;

/** @implements {Command} */
export default class AddCommand {
    static command = 'add';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `AddCommand::(${AddCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        const {values, positionals} = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: {values, positionals}} : Nothing;

        if (values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${AddCommand.description}`};
        }

        const filePath = path.resolve(ctx.input.trimStart().slice(AddCommand.command.length + 1));

        await fs.promises.writeFile(filePath, "", {flag: 'wx'}).catch(OperationFailedError.reThrowWith);

        yield {type: 'success', message: ctx.input, data: filePath}
    }
}
