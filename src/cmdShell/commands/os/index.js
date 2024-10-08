import os from 'node:os';
import {isCmdLineInputOf, outputMsg} from '#shell-command-utils';
import {getCmdArgsValues, parseCmdLine} from '#shell-utils';
import {pipe, pipeAsyncWith} from '#fp-utils';
import {InvalidInputError} from '#errors';

const osDataInfos = {
    EOL: outputMsg`EOL: ${JSON.stringify(os.EOL)}`,
    cpus: outputMsg`Total: ${os.cpus().length}\n${os.cpus().map(cpu => outputMsg`CPU: ${cpu.model}; clock rate: ${Math.round(cpu.speed / 100) / 10}GHz`).join("\r\n")}`,
    homedir: outputMsg`homedir: ${os.userInfo().homedir}`,
    username: outputMsg`username: ${os.userInfo().username}`,
    architecture: outputMsg`architecture: ${os.arch()}`,
}

/**
 * @param ctx
 * @returns {Promise<object>}
 */
const parseInput = (ctx) => {
    return pipeAsyncWith(parseCmdLine(ctx.input).slice(1), getCmdArgsValues(
        {name: "EOL", type: 'boolean', default: false},
        {name: "cpus", type: 'boolean', default: false},
        {name: "homedir", type: 'boolean', default: false},
        {name: "username", type: 'boolean', default: false},
        {name: "architecture", type: 'boolean', default: false},
    )).catch(InvalidInputError.reThrow(ctx.input));
}

/**
 *
 * @param {object} args
 * @returns {[string, string][]}
 */
const getOsInfoPerArgs = (args) => Object.entries(args)
    .filter(([_o, display]) => Boolean(display))
    .map(([o]) => osDataInfos[o])

/**
 * @implements {Command}
 */
class OSCommand {
    cmd = 'os';

    description = `
    Operating system info (prints following information in console)
     * os --EOL Get EOL (default system End-Of-Line) and print it to console
     * os --cpus Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them) and print it to console
     * os --homedir Get home directory and print it to console
     * os --username Get current system user name (Do not confuse with the username that is set when the application starts) and print it to console
     * os --architecture Get CPU architecture for which Node.js binary has compiled and print it to console
    `;

    execute(ctx) {
        // TODO AR >os without flags command (?)
        // TODO AR >os --cpus - why clock rate is zero(?)
        return parseInput(ctx).then(pipe(getOsInfoPerArgs, (message) => Promise.resolve({
            type: 'success',
            message: message
        })))
    }

    isCommandOf(cmdLine) {
        return isCmdLineInputOf(this, cmdLine);
    }
}

export default new OSCommand();