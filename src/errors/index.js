export class UnrecognizedCommandError extends Error {
    constructor(message = 'Unrecognized command') {
        super(message);
    }
}
