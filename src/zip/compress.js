import fs from 'node:fs';
import zlib from 'node:zlib';
import {withCurrentFileMetaUrl} from "../utils/index.js";

const {filePath: inputFilePath} = withCurrentFileMetaUrl(import.meta.url).getFileInDirPath('files', 'fileToCompress.txt');
const {filePath: outputFilePath} = withCurrentFileMetaUrl(import.meta.url).getFileInDirPath('files', 'archive.gz');

/**
 * @description The function that compresses file `fileToCompress.txt` to `archive.gz` using zlib and Streams API
 * @returns {Promise<void>}
 */
const compress = async () => {
    const gzip = zlib.createGzip();
    const fileReadStream = fs.createReadStream(inputFilePath, {encoding: "utf8", highWaterMark: 1});
    const fileWriteStream = fs.createWriteStream(outputFilePath, {encoding: "utf8", highWaterMark: 1});
    fileReadStream.pipe(gzip).pipe(fileWriteStream);
};

await compress();