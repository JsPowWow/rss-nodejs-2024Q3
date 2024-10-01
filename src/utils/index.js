import {Worker} from 'node:worker_threads';
import path from 'node:path';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

/**
 * @description The `always true` return function
 * @returns {true}
 */
export const stubTrue = () => true;

/**
 * @description The `always false` return function
 * @returns {false}
 */
export const stubFalse = () => false;

/**
 * @description Check if provided {@link x} number is odd
 * @param {number} x
 * @returns {boolean}
 */
export const isOddNumber = (x) => Boolean(x & 1);

/**
 * @description Check if provided {@link x} number is even
 * @param {number} x
 * @returns {boolean}
 */
export const isEvenNumber = (x) => !(x & 1);

/**
 * @description Check file existence using provided {@link path}
 * @param {string} path
 * @param {number=} mode
 * @returns {Promise<boolean>}
 */
export const isFileExistsAsync = (path, mode) =>
    fs.access(path, mode ? mode : fs.constants.F_OK).then(stubTrue, stubFalse)

/**
 * @param {string} currentFileMetaUrl fileURLToPath(import.meta.url) of provided file
 * @returns {{
 *  getDirPath: function(folderName: string): string,
 *  getFileInDirPath: (function(folderName: string, fileName: string): {filePath: string, dirPath: string})
 *  }}
 */
export const withCurrentFileMetaUrl = (currentFileMetaUrl) => {
    const __dirname = path.dirname(fileURLToPath(currentFileMetaUrl));
    return {
        /**
         * @param {string} folderName
         * @returns string
         */
        getDirPath: function (folderName) {
            return path.join(__dirname, folderName);
        },
        /**
         * @param {string} folderName
         * @param {string} fileName
         * @returns {{filePath: string, dirPath: string}}
         */
        getFileInDirPath: function (folderName, fileName) {
            const dirPath = this.getDirPath(folderName);
            const filePath = path.join(dirPath, fileName);
            return ({dirPath, filePath});
        }
    }
}

export const fileSystemOperationFailError = () => new Error("FS operation failed");

export const throwFileSystemOperationFailError = () => {
    throw fileSystemOperationFailError();
};

/**
 * @param {string} filePath
 * @returns {Promise<void>}
 */
export const assertFileExistsAsync = async (filePath) => isFileExistsAsync(filePath).then((exists) => {
    if (!exists) {
        throw fileSystemOperationFailError()
    }
})

/**
 * @param {string} filePath
 * @returns {Promise<void>}
 */
export const assertFileNotExistsAsync = async (filePath) => isFileExistsAsync(filePath).then((exists) => {
    if (exists) {
        throw fileSystemOperationFailError()
    }
})

/**
 * @description Spawn the worker
 * @param {object} options
 * @param {function (object):void} options.onComplete The worker work complete callback handler
 * @param {function (Error):void} options.onError The worker error callback handler
 * @param {string} options.filePath
 * @param {object} options.data
 * @returns {Worker}
 */
export const spawnWorker = ({filePath, onComplete, onError, data}) =>
    new Worker(filePath, {name: 'fiboCalculator', workerData: data})
        .on('message', (res) => onComplete({status: 'resolved', data: res}))
        .on('error', (_err) => onError({status: 'error', data: null}))