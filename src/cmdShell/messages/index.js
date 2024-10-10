import {ansi, log, styledMsg} from '#console-utils';
import {tap} from '#fp-utils';
import {InvalidInputError} from '#shell-errors';
import {getCurrentWorkingDir} from '#shell-utils';

export const outputMsg = styledMsg({text: 'cyan', values: 'yellowBright'});
export const output2Msg = styledMsg({text: 'magenta'});
export const warningMsg = styledMsg({text: ['yellow', 'italic'], values: ['yellowBright', 'italic']});
export const errorMsg = styledMsg({text: ['red', 'bold', 'italic'], values: ['yellow', 'italic']});
export const shellPromptMsg = styledMsg({text: 'whiteBright'});

export const logDebug = (...args) => console.log(ansi.bgGrey(), "~~~~ ", ...args, ansi.reset());
export const tapLogDebug = tap(logDebug);

export const logCurrentWorkingDir = () => log(outputMsg`You are currently in ${getCurrentWorkingDir()}`)

export const missingInputOperandsMsg = (command) => [
    warningMsg`${InvalidInputError.MESSAGE}\n${command}: missing operand(s)`,
    warningMsg`Try '${command + ''} ${'--help'}' for more information`
].join("\n")

