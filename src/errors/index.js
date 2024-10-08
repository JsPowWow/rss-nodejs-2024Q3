export class InvalidInputError extends Error {
    static throw(input = '') {
        throw new InvalidInputError(input);
    }

    static reThrow = (input = '') => (err) => {
        const invalidInputError = new InvalidInputError(input);
        invalidInputError.cause = err;
        throw invalidInputError;
    }

    #input = ''

    constructor(input = '') {
        super(`Invalid input: ${input}`);
        this.#input = input;
    }

    get input() {
        return this.#input;
    }
}
