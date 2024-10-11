import {readdir} from 'node:fs/promises'
import path from 'node:path'

import {getCurrentWorkingDir, parseCmdLine, withCmdArgsValues} from '#shell-utils';
import {Nothing, pipeAsyncWith} from '#fp-utils';
import {assertNoExtraPositionals, InvalidInputError, OperationFailedError} from '#shell-errors';
import {output2Msg, outputMsg} from '#shell-messages';

const COMMAND_DESCRIPTION = outputMsg`Print in console list of all files and folders (${'ls'}) in current directory.
    * list contain files and folder names (for files - with extension);
    * folders and files are sorted in alphabetical order ascending, list of folders goes first;
    * type of directory content marked explicitly (e.g. as a corresponding column value);`;

/**
 * @param {CmdExecContext} ctx
 * @returns {Promise<ParsedArgs>}
 */
const parseInput = ctx =>
    pipeAsyncWith(parseCmdLine(ctx.input).slice(1),
        withCmdArgsValues(
            {name: 'help', type: 'boolean', default: false}
        )).catch(InvalidInputError.reThrowWith(ctx.input));

/**
 * @param {Dirent} file
 * @return {{name:string, type: string}}
 */
const toNameAndType = (file) => ({name: file.name, type: file.isFile() ? "f" : "D"});

/**
 * @param {{name:string, type: string}} a
 * @param {{name:string, type: string}} b
 * @return {number}
 */
const sortByTypeAndName = (a, b) => {
    if (a.type === 'D' && b.type === 'f') {
        return -1;
    }
    if (a.type === 'f' && b.type === 'D') {
        return 1;
    }
    return a.name.localeCompare(b.name);
};


/**
 * @param {{name:string, type: string}} file
 * @return {string}
 */
const toOutputString = (file) => output2Msg`${file.type === 'D' ? 'DIR'.padEnd(8) : 'file'.padEnd(8)} ${file.name}`


/** @implements {Command} */
export default class LSCommand {
    static command = 'ls';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `LSCommand::(${LSCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        const {values, positionals} = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: values} : Nothing;

        assertNoExtraPositionals(LSCommand.command, {values, positionals});

        if (values['help']) {
            return yield {type: 'success', message: ctx.input, data: outputMsg`${LSCommand.description}`};
        }

        const currentDir = path.resolve(getCurrentWorkingDir());
        ctx.debug ? yield {type: 'debug', message: 'currentDir', data: currentDir} : Nothing;

        const filesInDir = await readdir(currentDir, {withFileTypes: true})
            .catch(OperationFailedError.reThrowWith);
        ctx.debug ? yield {type: 'debug', message: 'files', data: filesInDir} : Nothing;

        return yield {
            type: 'success', message: ctx.input, data: filesInDir
                .map(toNameAndType)
                .sort(sortByTypeAndName)
                .map(toOutputString).join('\n')
        };
    }
}
