import Stream from 'node:stream';

const reverseStream = new Stream.Transform({
    transform(chunk, _encoding, callback) {
        this.push(String(chunk).split('').reverse().join(''));
        callback();
    }
});

/**
 * @description The function that reads data from `process.stdin`, reverses text using `Transform Stream` and then writes it into `process.stdout`
 * @returns {Promise<void>}
 */
const transform = async () => {
    process.stdin.pipe(reverseStream).pipe(process.stdout);
};

await transform();