import {isCmdLineInputOf} from '#shell-command-utils';

/**
 * @implements {Command}
 */
class ExitCommand {
    cmd = '.exit';

    description = 'Finish program';

    execute(ctx) {
        ctx.rl.close();
        return Promise.resolve(undefined);
    }

    isCommandOf(cmdLine) {
        return isCmdLineInputOf(this, cmdLine);
    }
}

export default new ExitCommand();