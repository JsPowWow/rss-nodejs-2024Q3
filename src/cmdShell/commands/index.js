import {default as ls} from "./ls/index.js";
import {default as exit} from "./exit/index.js";

export const commands = Object.freeze({
    [exit.name] : exit,
    [ls.name] : ls,
})