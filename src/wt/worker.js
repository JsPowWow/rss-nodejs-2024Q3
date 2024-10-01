import {parentPort, workerData} from 'node:worker_threads';

// n should be received from main thread
const nthFibonacci = (n) => n < 2 ? n : nthFibonacci(n - 1) + nthFibonacci(n - 2);

const sendResult = () => {
    // Uncomment to simulate Error
    // if (workerData === 13) {
    //     throw new Error('Something goes wrong');
    // }
    parentPort.postMessage(nthFibonacci(workerData));
};

sendResult();