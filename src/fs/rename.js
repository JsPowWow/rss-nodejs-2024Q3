import fs from 'node:fs/promises';
import {assertFileExistsAsync, assertFileNotExistsAsync, withCurrentFileMetaUrl} from "../utils/index.js";

const currentFile = withCurrentFileMetaUrl(import.meta.url);
const {filePath: wrongFileNameFilePath} = currentFile.getFileInDirPath('files', 'wrongFilename.txt');
const {filePath: properFileNameFilePath} = currentFile.getFileInDirPath('files', 'properFilename.md');

/**
 * @description The function that renames file `wrongFilename.txt` to `properFilename` with extension `.md`;
 * If there's no file `wrongFilename.txt` or `properFilename.md` already exists - the `Error` with message `FS operation failed` will be thrown.
 * @returns {Promise<void>}
 */
const rename = async () =>
    assertFileExistsAsync(wrongFileNameFilePath)
        .then(() => assertFileNotExistsAsync(properFileNameFilePath))
        .then(() => fs.rename(wrongFileNameFilePath, properFileNameFilePath));

await rename();