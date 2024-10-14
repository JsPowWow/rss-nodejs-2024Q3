import {getCurrentUserName, withCmdArgsValues} from '#shell-utils';
import process from 'node:process';
import {warningMsg} from '#shell-messages';
import {log} from '#console-utils';
import {InvalidInputError} from '#shell-errors';

const ARG_USERNAME = "username";

export default class Bootstrap {
    /**
     * @type object
     */
    #argsMap

    /**
     * @type {string}
     */
    #username = "";

    constructor() {
        try {
            const {values} = withCmdArgsValues({
                name: ARG_USERNAME,
                type: 'string',
                default: ''
            })(process.argv.slice(2));
            this.#argsMap = values;
            this.#username = this.#argsMap[ARG_USERNAME];
            if (!this.#username) {
                InvalidInputError.throw("Missing --username option");
            }
        } catch (e) {
            const osUserName = getCurrentUserName();
            log(warningMsg`${'--username'} option is missing. The os username will used;`);
            this.#username = osUserName;
        }
    }

    /**
     * @return {string}
     */
    getUserName = () => {
        return this.#username;
    }
};
