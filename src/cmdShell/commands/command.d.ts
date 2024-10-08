import { Interface } from "readline/promises"

export type CmdExecContext = {
    rl: Interface;
    input: string;
    command?: Command,
    debug?: boolean;
}

export type CmdResultType = 'info' | 'success' | 'warning';
export type CmdResult = { type: CmdResultType, message: string | string[] }

export interface Command {
    cmd: string;

    description: string;

    isCommandOf(cmdLine: string): boolean;

    execute(ctx: CmdExecContext): Promise<CmdResult | undefined>;
}

export type CommandsConfig = Record<string, Command | undefined>;