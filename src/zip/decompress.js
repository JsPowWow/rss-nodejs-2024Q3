import fs from 'node:fs';
import zlib from 'node:zlib';
import {withCurrentFileMetaUrl} from "../utils/index.js";

const {filePath: inputFilePath} = withCurrentFileMetaUrl(import.meta.url).getFileInDirPath('files', 'archive.gz');
const {filePath: outputFilePath} = withCurrentFileMetaUrl(import.meta.url).getFileInDirPath('files', 'fileToCompress.txt');

/**
 * @description The function that decompresses `archive.gz` back to the `fileToCompress.txt` with same content as before compression using `zlib` and Streams API
 * @returns {Promise<void>}
 */
const decompress = async () => {
    const gunzip = zlib.createGunzip();
    const fileReadStream = fs.createReadStream(inputFilePath);
    const fileWriteStream = fs.createWriteStream(outputFilePath);
    fileReadStream.pipe(gunzip).pipe(fileWriteStream);
};

await decompress();