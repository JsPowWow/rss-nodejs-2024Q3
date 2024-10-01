import fs from 'node:fs/promises';
import {assertFileNotExistsAsync, isFileExistsAsync, withCurrentFileMetaUrl} from "../utils/index.js";

const {dirPath, filePath} = withCurrentFileMetaUrl(import.meta.url).getFileInDirPath('files', 'fresh.txt');

/**
 * @description The function that creates new file `fresh.txt` with content `I am fresh and young`inside the `files` folder;
 * If file `fresh.txt` already exists - the `Error` with message `FS operation failed` will be thrown.
 * @returns {Promise<void>}
 */
const create = async () =>
    assertFileNotExistsAsync(filePath)
        .then(() => isFileExistsAsync(dirPath))
        .then((isFolderExists) => !isFolderExists ? fs.mkdir(dirPath) : undefined)
        .then(() => fs.writeFile(filePath, 'I am fresh and young', {encoding: 'utf8'}));

await create();