const args = process.argv.slice(2);

console.log(`Total number of arguments is ${args.length}`);
console.log(`Arguments: ${JSON.stringify(args)}`);

const echoInput = (chunk) => {
    process.stdout.write(`Received from master process: ${chunk.toString()}\n`)
    if (chunk.toString().includes('CLOSE')) {
        process.exit(0);
    }
};

process.stdin.on('data', echoInput);
