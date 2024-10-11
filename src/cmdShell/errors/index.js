import {missingInputOperandsMsg} from '#shell-messages';

export class InvalidInputError extends Error {
    static MESSAGE = 'Invalid input';

    input = ''

    constructor(inputString = '') {
        super(`${InvalidInputError.MESSAGE}: ${inputString}`);
        this.input = inputString;
    }

    static throw(inputString = '') {
        throw new InvalidInputError(inputString);
    }

    static reThrowWith = (inputString = '') => (err) => {
        const invalidInputError = new InvalidInputError(inputString);
        invalidInputError.cause = err;
        throw invalidInputError;
    }
}


export class OperationFailedError extends Error {
    static MESSAGE = 'Operation failed';

    constructor(message = '') {
        super(`${OperationFailedError.MESSAGE}: ${message}`);
    }

    static throw(message = '') {
        throw new OperationFailedError(message);
    }

    static reThrowWith = (err) => {
        const invalidOperationError = new OperationFailedError();
        invalidOperationError.cause = err;
        throw invalidOperationError;
    }
}

/**
 * @param {string} arg
 * @param {string[]} positionals
 */
export function assertNoExtraPositionals(arg, positionals) {
    const extraPositionals = positionals?.filter((p) => p !== arg) ?? [];
    if (extraPositionals.length > 0) {
        InvalidInputError.throw(`Unknown param(s): ${positionals?.join(" ")}`);
    }
}

/**
 * @param {string} command
 * @param {object} args
 */
export function assertHasOptions(command, args) {
    if (Object.values(args).every((p) => p === false)) {
        InvalidInputError.throw(missingInputOperandsMsg(command));
    }
}
