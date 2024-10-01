import fs from 'node:fs/promises';
import {assertFileExistsAsync, withCurrentFileMetaUrl} from "../utils/index.js";

const {filePath} = withCurrentFileMetaUrl(import.meta.url).getFileInDirPath('files', 'fileToRead.txt');

/**
 * @description The function that prints content of the `fileToRead.txt` into console;
 * If there's no file `fileToRead.txt` - the `Error` with message `FS operation failed` will be thrown;
 * @returns {Promise<void>}
 */
const read = async () =>
    assertFileExistsAsync(filePath)
        .then(() => fs.readFile(filePath, {encoding: 'utf8'}))
        .then(console.log);

await read();