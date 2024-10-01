import fs from 'node:fs';
import crypto from "node:crypto";
import {withCurrentFileMetaUrl} from "../utils/index.js";

const {filePath} = withCurrentFileMetaUrl(import.meta.url).getFileInDirPath('files', 'fileToCalculateHashFor.txt');

/**
 * @description The function that calculates SHA256 hash for file `fileToCalculateHashFor.txt` and logs it into console as `hex` using Streams API
 * @returns {Promise<void>}
 */
const calculateHash = async () => {
    const hash = crypto.createHash("sha256");
    const fileStream = fs.createReadStream(filePath, {encoding: "utf8", highWaterMark: 1});
    for await (const chunk of fileStream) {
        hash.update(chunk);
    }
    const fileHash = hash.digest("hex");
    console.log(`The 'fileToCalculateHashFor.txt' SHA256 hash is ${fileHash}`);
};

await calculateHash();