import {default as exit} from "./exit/index.js";
import {default as os} from "./os/index.js";

/** @type {CommandsConfig} */
export const commands = Object.freeze({
    [exit.cmd]: exit,
    [os.cmd]: os,
});