import os from 'node:os';
import {isCmdLineInputOf} from '#shell-command-utils';
import {getCmdArgsValues, parseCmdLine} from '#shell-utils';
import {pipe, pipeAsyncWith} from '#fp-utils';
import {InvalidInputError} from '#errors';
import {styledMsg} from '#console-utils';

const osDataInfos = {
    EOL: styledMsg({text: 'cyan', values: 'yellowBright'})`EOL: ${JSON.stringify(os.EOL)}`,
    cpus: styledMsg({
        text: 'cyan',
        values: 'yellowBright'
    })`Total: ${os.cpus().length}\n${os.cpus().map((cpu) => (`${cpu.model}; clock rate: ${Math.round(cpu.speed / 100) / 10} GHz`)).join("\r\n")}`,
    homedir: styledMsg({text: 'cyan', values: 'yellowBright'})`homedir: ${os.userInfo().homedir}`,
    username: styledMsg({text: 'cyan', values: 'yellowBright'})`username: ${os.userInfo().username}`,
    architecture: styledMsg({text: 'cyan', values: 'yellowBright'})`architecture: ${os.arch()}`,
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
     * Get EOL (default system End-Of-Line) and print it to console
        os --EOL
     * Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them) and print it to console
        os --cpus
     * Get home directory and print it to console
        os --homedir
     * Get current system user name (Do not confuse with the username that is set when the application starts) and print it to console
        os --username
     * Get CPU architecture for which Node.js binary has compiled and print it to console
        os --architecture
    `;

    execute(ctx) {
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