import fs from 'node:fs/promises';
import {assertFileExistsAsync, withCurrentFileMetaUrl} from "#utils";

const {filePath} = withCurrentFileMetaUrl(import.meta.url).getFileInDirPath('files', 'fileToRemove.txt');

/**
 * @description The function that deletes file `fileToRemove.txt`;
 * If there's no file `fileToRemove.txt` - the `Error` with message `FS operation failed` will be thrown.
 * @returns {Promise<void>}
 */
const remove = async () => assertFileExistsAsync(filePath).then(() => fs.rm(filePath));

await remove();