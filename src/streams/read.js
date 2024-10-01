import fs from 'node:fs';
import {withCurrentFileMetaUrl} from "../utils/index.js";

const {filePath} = withCurrentFileMetaUrl(import.meta.url).getFileInDirPath('files', 'fileToRead.txt');

/**
 * @description The function that reads file `fileToRead.txt` content using Readable Stream and prints it's content into `process.stdout`
 * @returns {Promise<void>}
 */
const read = async () => {
    fs.createReadStream(filePath, {encoding: "utf8", highWaterMark: 1}).pipe(process.stdout);
};

await read();