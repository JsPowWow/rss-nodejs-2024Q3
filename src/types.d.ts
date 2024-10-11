import {Interface} from "readline/promises"

export type ParsedArgs = {
    values: object;
    positionals: string[];
    tokens?: object;
};

export interface Command {
    execute(ctx: CmdExecContext): AsyncGenerator<CmdOperation>;
}

export type CommandsConfig = Record<string, {
    factory: CallableFunction;
    description: string
}>;

export type CmdExecContext = {
    rl: Interface;
    input: string;
    debug?: boolean;
}

export type CmdOperationType = 'success' | 'debug';
export type CmdOperation = { type: CmdOperationType, message: string, data?: unknown };

export interface CommanderOptions {
    commandsConfig: CommandsConfig;
    onStart?: (username: string) => void;
    onClose?: (username: string) => void;
    onError: (error: Error) => void;
    onResult: (result: CmdOperation) => void;
    onDebug?: (result: CmdOperation) => void;
    debug?: boolean;
}

