export class UnrecognizedCommandError extends Error {
    static throw() {
        throw new UnrecognizedCommandError();
    }

    static MESSAGE = 'Unrecognized command';

    constructor(message = UnrecognizedCommandError.MESSAGE) {
        super(message);
    }
}
