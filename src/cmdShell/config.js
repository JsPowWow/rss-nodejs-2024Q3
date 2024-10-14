import ExitCommand from "#shell-commands/exit.js";
import OsCommand from "#shell-commands/os.js";
import ListDirectoryCommand from '#shell-commands/ls.js';
import GoToDirectoryCommand from '#shell-commands/cd.js';
import DirectoryUpCommand from '#shell-commands/up.js';
import StreamFileContentCommand from '#shell-commands/file/cat.js';
import CreateFileCommand from '#shell-commands/file/add.js';
import RemoveFileCommand from '#shell-commands/file/rm.js';
import FileHashCommand from '#shell-commands/file/hash.js';
import RenameCommand from '#shell-commands/file/rn.js';
import CopyFileCommand from '#shell-commands/file/cp.js';
import MoveFileCommand from '#shell-commands/file/mv.js';
import CompressFileCommand from '#shell-commands/file/compress.js';
import DeCompressFileCommand from '#shell-commands/file/decompress.js';

/** @type {CommandsConfig} */
export const commandsConfig = Object.freeze({
    // no arguments commands
    [ExitCommand.command]: {factory: () => new ExitCommand(), description: ExitCommand.description, debug: false},
    [OsCommand.command]: {factory: () => new OsCommand(), description: OsCommand.description, debug: false}, // many options command
    [ListDirectoryCommand.command]: {
        factory: () => new ListDirectoryCommand(),
        description: ListDirectoryCommand.description,
        debug: false
    },
    [DirectoryUpCommand.command]: {
        factory: () => new DirectoryUpCommand(),
        description: DirectoryUpCommand.description,
        debug: false
    },
    // one argument commands
    [GoToDirectoryCommand.command]: {
        factory: () => new GoToDirectoryCommand(),
        description: GoToDirectoryCommand.description,
        debug: false
    },
    [StreamFileContentCommand.command]: {
        factory: () => new StreamFileContentCommand(),
        description: StreamFileContentCommand.description,
        debug: false
    },
    [CreateFileCommand.command]: {
        factory: () => new CreateFileCommand(),
        description: CreateFileCommand.description,
        debug: false
    },
    [RemoveFileCommand.command]: {
        factory: () => new RemoveFileCommand(),
        description: RemoveFileCommand.description,
        debug: false
    },
    [FileHashCommand.command]: {
        factory: () => new FileHashCommand(),
        description: FileHashCommand.description,
        debug: false
    },
    // two arguments commands
    [RenameCommand.command]: {
        factory: () => new RenameCommand(),
        description: RenameCommand.description,
        debug: false
    },
    [CopyFileCommand.command]: {
        factory: () => new CopyFileCommand(),
        description: CopyFileCommand.description,
        debug: false
    },
    [MoveFileCommand.command]: {
        factory: () => new MoveFileCommand(),
        description: MoveFileCommand.description,
        debug: false
    },
    [CompressFileCommand.command]: {
        factory: () => new CompressFileCommand(),
        description: CompressFileCommand.description,
        debug: false
    },
    [DeCompressFileCommand.command]: {
        factory: () => new DeCompressFileCommand(),
        description: DeCompressFileCommand.description,
        debug: false
    },
});
