import fs from 'node:fs/promises';
import {assertFileExistsAsync, withCurrentFileMetaUrl} from "../utils/index.js";

const filesDirPath = withCurrentFileMetaUrl(import.meta.url).getDirPath('files');

/**
 * @description The function that prints all array of filenames from `files` folder into console;
 * If `files` folder doesn't exists - the `Error` with message `FS operation failed` will be thrown.
 * @returns {Promise<void>}
 */
const list = async () =>
    assertFileExistsAsync(filesDirPath)
        .then(() => fs.readdir(filesDirPath))
        .then(console.log);

await list();