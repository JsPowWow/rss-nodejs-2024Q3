import {missingInputOperandsMsg} from '#shell-messages';
import {stubFalse, stubTrue} from '#common-utils';
import fs from 'node:fs';
import {isFileAsync} from '#shell-utils';

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
        super(message
            ? `${message}`
            : `${OperationFailedError.MESSAGE}`);
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
 * @param {string} command
 * @param {ParsedArgs} args
 */
export function assertNoExtraPositionals(command, args) {
    const {positionals} = args;
    const extraPositionals = positionals?.filter((p) => p !== command) ?? [];
    if (extraPositionals.length > 0) {
        InvalidInputError.throw(`Unknown param(s): ${extraPositionals?.join(" ")}`);
    }
}

/**
 * @param {string} command
 * @param {number} expectedNum
 * @param {ParsedArgs} args
 */
export function assertHasExpectedPositionalsNum(command, expectedNum, args) {
    const {positionals, values} = args;
    const extraPositionals = positionals?.filter((p) => p !== command) ?? [];
    if (extraPositionals.length < expectedNum && !values['help']) {
        InvalidInputError.throw(`Expect to have: ${expectedNum} param(s) provided.`);
    }
    if (values['help'] && extraPositionals.length > 0) {
        InvalidInputError.throw(`Expect to have either --help or param(s) provided.`);
    }
    if (extraPositionals.length > expectedNum) {
        InvalidInputError.throw(`Unknown param(s): ${positionals?.slice(expectedNum).join(" ")}`);
    }
}

/**
 * @param {string} command
 * @param {number} minExpectedNum
 * @param {ParsedArgs} args
 */
export function assertHasMinExpectedPositionalsNum(command, minExpectedNum, args) {
    const {positionals, values} = args;
    const extraPositionals = positionals?.filter((p) => p !== command) ?? [];
    if (extraPositionals.length < minExpectedNum && !values['help']) {
        InvalidInputError.throw(`Expect to have: ${minExpectedNum} param(s) provided.`);
    }
    if (values['help'] && extraPositionals.length > 0) {
        InvalidInputError.throw(`Expect to have either --help or param(s) provided.`);
    }
}


/**
 * @param {string} command
 * @param {ParsedArgs} args
 */
export function assertHasOptions(command, args) {
    const {values} = args;
    if (Object.values(values).every((p) => p === false)) {
        InvalidInputError.throw(missingInputOperandsMsg(command));
    }
}


/**
 * @description Check file existence using provided {@link path}
 * @param {string} path
 * @param {number=} mode
 * @returns {Promise<boolean>}
 */
export const isFileExistsAsync = (path, mode) =>
    fs.promises.access(path, mode ? mode : fs.constants.F_OK).then(stubTrue, stubFalse)

/**
 * @param {string} filePath
 * @returns {Promise<void>}
 */
export const assertFileExistsAsync = async (filePath) => isFileExistsAsync(filePath).then((exists) => {
    if (!exists) {
        throw OperationFailedError.throw(`The ${filePath} does not exist`);
    }
})

/**
 * @param {string} filePath
 * @returns {Promise<void>}
 */
export const assertFileNotExistsAsync = async (filePath) => isFileExistsAsync(filePath).then((exists) => {
    if (exists) {
        throw OperationFailedError.throw(`The ${filePath} already exist`)
    }
})

/**
 * @param {string} filePath
 * @returns {Promise<void>}
 */
export const assertIsFile  = async (filePath) => isFileAsync(filePath).then((isFile) => {
    if (!isFile) {
        throw OperationFailedError.throw(`The ${filePath} is not a file`);
    }
})
