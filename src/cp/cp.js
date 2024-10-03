import cp from 'node:child_process';
/**
 * @description The function that receives array of arguments args and creates child process from file `script.js`, passing these args to it.
 * This function should create IPC-channel between `stdin` and `stdout` of master process and child process:
 *  - child process `stdin` should receive input from master process stdin
 *  - child process `stdout` should send data to master process stdout
 * @param argsCLOSE
 * @returns {Promise<void>}
 */
import {withCurrentFileMetaUrl} from "#utils";

const {filePath} = withCurrentFileMetaUrl(import.meta.url).getFileInDirPath('files', 'script.js');

const spawnChildProcess = async (args) => {
    cp.fork(filePath, args);
};

await spawnChildProcess(['arg1', 'arg2']); // Put your arguments in function call to test this functionality
