import {cpus} from 'node:os';

import {spawnWorker, withCurrentFileMetaUrl} from "../utils/index.js";

const {filePath} = withCurrentFileMetaUrl(import.meta.url).getFileInDirPath('', 'worker.js');

const STARTING_FIBO_NUMBER = 10;

const performCalculations = async () =>
    Promise.all(new Array(cpus().length)
        .fill(null)
        .map((_, idx) => {
            const {promise, resolve} = Promise.withResolvers();
            spawnWorker({
                filePath,
                data: STARTING_FIBO_NUMBER + idx,
                onComplete: resolve,
                onError: resolve
            })
            return promise;
        }))
        .then(console.log);

await performCalculations();