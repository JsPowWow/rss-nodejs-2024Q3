import {ansi, styledMsg} from '#console-utils';
import {tap} from '#fp-utils';

export const outputMsg = styledMsg({text: 'cyan', values: 'yellowBright'});
export const output2Msg = styledMsg({text: 'magenta'});
export const output3Msg = styledMsg({text: 'whiteBright'});
export const warningMsg = styledMsg({text: ['yellow', 'italic'], values: ['yellowBright', 'italic']});
export const errorMsg = styledMsg({text: ['red', 'bold', 'italic'], values: ['yellow', 'italic']});
export const shellPromptMsg = styledMsg({text: 'whiteBright'});

export const logDebug = (...args) => console.log(ansi.bgGrey(), "~~~~ ", ...args, ansi.reset());
export const tapLogDebug = tap(logDebug);

export const missingInputOperandsMsg = (command) => [
    warningMsg`"${command}" missing operand(s)`,
    warningMsg`Try '${command + ''} ${'--help'}' for more information`
].join("\n")

