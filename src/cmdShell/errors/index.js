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
