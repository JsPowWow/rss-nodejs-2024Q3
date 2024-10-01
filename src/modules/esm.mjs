import path from 'node:path';
import {readFile} from 'fs/promises';
import {release, version} from 'node:os';
import {createServer as createServerHttp} from 'node:http';
import "./files/c.js";

const random = Math.random();

const unknownObject = random > 0.5 ?
    await readFile(new URL('./files/a.json', import.meta.url), {encoding: 'utf8'}).then(JSON.parse) :
    await readFile(new URL('./files/b.json', import.meta.url), {encoding: 'utf8'}).then(JSON.parse)

/**
 // ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
 const unknownObject = random > 0.5 ?
 await import('./files/a.json',{ with: { type: "json" }}).then(JSON.parse) :
 await import('./files/b.json',{ with: { type: "json" }}).then(JSON.parse)
 */

console.log(`Release ${release()}`);
console.log(`Version ${version()}`);
console.log(`Path segment separator is "${path.sep}"`);

console.log(`Path to current file is ${import.meta.filename}`);
console.log(`Path to current directory is ${import.meta.dirname}`);

const myServer = createServerHttp((_, res) => {
    res.end('Request accepted');
});

const PORT = 3000;

console.log(unknownObject);

myServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('To terminate it, use Ctrl+C combination');
});

export {unknownObject, myServer};

