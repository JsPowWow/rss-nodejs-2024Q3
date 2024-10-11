import {createReadStream} from 'node:fs'
import path from 'node:path'
import crypto from "node:crypto";
import {parseInputForHelpOption} from '#shell-utils';
import {Nothing} from '#fp-utils';
import {output3Msg, outputMsg} from '#shell-messages';
import {OperationFailedError} from '#shell-errors';

const COMMAND_DESCRIPTION = outputMsg`Calculate hash for file and print it into console`;

const parseInput = parseInputForHelpOption;

/** @implements {Command} */
export default class HashCommand {
    static command = 'hash';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `HashCommand::(${HashCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        const {values, positionals} = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: {values, positionals}} : Nothing;

        if (values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${HashCommand.description}`};
        }
        const hash = crypto.createHash("sha256");
        const filePath = path.resolve(ctx.input.trimStart().slice(HashCommand.command.length + 1));

        try {
            for await (const chunk of createReadStream(filePath, {encoding: 'utf8'})) {
                hash.update(chunk);
            }

        } catch (e) {
            OperationFailedError.reThrowWith(e);
        }
        const fileHash = hash.digest("hex");

        yield {type: 'success', message: ctx.input, data: output3Msg`Hash: ${fileHash}`};
    }
}
