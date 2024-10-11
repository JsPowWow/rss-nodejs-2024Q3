import os from 'node:os';
import {assertNoExtraPositionals, parseCmdLine, withCmdArgsValues} from '#shell-utils';
import {Nothing, pipeAsyncWith} from '#fp-utils';
import {InvalidInputError} from '#shell-errors';
import {missingInputOperandsMsg, outputMsg} from '#shell-messages';

const COMMAND_DESCRIPTION = outputMsg`Operating system info (prints following information in console)
    * ${'os --EOL'} Get EOL (default system End-Of-Line) and print it to console
    * ${'os --cpus'} Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them) and print it to console
    * ${'os --homedir'} Get home directory and print it to console
    * ${'os --username'} Get current system user name (Do not confuse with the username that is set when the application starts) and print it to console
    * ${'os --architecture'} Get CPU architecture for which Node.js binary has compiled and print it to console`;

const outputPerArgsInfos = {
    EOL: outputMsg`EOL: ${JSON.stringify(os.EOL)}`,
    cpus: outputMsg`Overall amount: ${os.availableParallelism()}\n${os.cpus().map(cpu => outputMsg`CPU: ${cpu.model}; clock rate: ${Math.round(cpu.speed / 100) / 10}GHz`).join('\r\n')}`,
    homedir: outputMsg`homedir: ${os.userInfo().homedir}`,
    username: outputMsg`username: ${os.userInfo().username}`,
    architecture: outputMsg`architecture: ${os.arch()}`,
    help: outputMsg`${COMMAND_DESCRIPTION}`
};

/**
 * @param {CmdExecContext} ctx
 * @returns {Promise<ParsedArgs>}
 */
const parseInput = ctx =>
    pipeAsyncWith(parseCmdLine(ctx.input).slice(1),
        withCmdArgsValues(
            {name: 'EOL', type: 'boolean', default: false},
            {name: 'cpus', type: 'boolean', default: false},
            {name: 'homedir', type: 'boolean', default: false},
            {name: 'username', type: 'boolean', default: false},
            {name: 'architecture', type: 'boolean', default: false},
            {name: 'help', type: 'boolean', default: false}
        )).catch(InvalidInputError.reThrowWith(ctx.input));

/**
 * @param {object} args
 * @returns {[string, string][]}
 */
const getOutputInfoByArgs = args => Object.entries(args)
    .filter(([_o, display]) => Boolean(display))
    .map(([o]) => outputPerArgsInfos[o]);

/** @implements {Command} */
export default class OSCommand {
    static command = 'os';

    static description = COMMAND_DESCRIPTION;

    get [Symbol.toStringTag]() {
        return `OSCommand::(${OSCommand.command})`;
    }

    /**
     * @param {CmdExecContext} ctx
     * @returns {AsyncGenerator<CmdOperation, void, *>}
     */
    async* execute(ctx) {
        const {values: args, positionals} = await parseInput(ctx);
        ctx.debug ? yield {type: 'debug', message: 'parsed arguments', data: args} : Nothing;

        assertNoExtraPositionals(OSCommand.command, positionals);

        const requestedOutput = getOutputInfoByArgs(args);
        ctx.debug ? yield {type: 'debug', message: 'requested OS Infos', data: requestedOutput} : Nothing;

        return yield {
            type: 'success', message: ctx.input, data: requestedOutput.length
                ? requestedOutput.join('\n')
                : missingInputOperandsMsg(OSCommand.command)
        };
    }
}
