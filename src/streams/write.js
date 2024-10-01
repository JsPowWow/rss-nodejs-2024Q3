import fs from 'node:fs';
import {withCurrentFileMetaUrl} from "../utils/index.js";

const {filePath} = withCurrentFileMetaUrl(import.meta.url).getFileInDirPath('files', 'fileToWrite.txt');

/**
 * @description The function that writes `process.stdin` data into file `fileToWrite.txt` content using Writable Stream
 * @returns {Promise<void>}
 */
const write = async () => {
    process.stdin.pipe(fs.createWriteStream(filePath, {encoding: "utf8", highWaterMark: 1}));
};

await write();