import fs from 'node:fs/promises';
import {assertFileExistsAsync, assertFileNotExistsAsync, withCurrentFileMetaUrl} from "#utils";

const currentFile = withCurrentFileMetaUrl(import.meta.url);
const filesDirPath = currentFile.getDirPath('files');
const filesCopyDirPath = currentFile.getDirPath('files_copy');

/**
 * @description The function that copies folder files `files` with all its content into folder `files_copy` at the same level;
 * If `files` folder doesn't exists or `files_copy` has already been created - the `Error` with message `FS operation failed` will be thrown.
 * @returns {Promise<void>}
 */
const copy = async () =>
    assertFileExistsAsync(filesDirPath)
        .then(() => assertFileNotExistsAsync(filesCopyDirPath))
        .then(() => fs.cp(filesDirPath, filesCopyDirPath, {recursive: true}));

await copy();
