import {Interface} from "readline/promises"

export type ParsedArgs = {
    values: object;
    positionals: string[];
    tokens?: object;
};

export interface Command {
    execute(ctx: CmdExecContext): AsyncGenerator<CmdResult>;
}

export type CommandsConfig = Record<string, {
    factory: CallableFunction;
    description: string
}>;

export type CmdExecContext = {
    rl: Interface;
    input: string;
    output: (...args: unknown[]) => void;
    command: Command,
    debug?: boolean;
}

export type CmdResultType = 'info' | 'debug' | 'warning';
export type CmdResult = { type: CmdResultType, message: string, data?: unknown };

export interface CommanderOptions {
    commandsConfig: CommandsConfig;
    onStart?: (username: string) => void;
    onClose?: (username: string) => void;
    onError: (error: Error) => void;
    debug?: boolean;
}

