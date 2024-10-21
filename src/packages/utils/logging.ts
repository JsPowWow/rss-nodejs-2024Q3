import { ansi, styledMsg } from './styledConsole';

export const outputMsg = styledMsg({ text: 'cyan', values: 'yellowBright' });
export const output2Msg = styledMsg({ text: 'magenta', values: 'blueBright' });
export const output3Msg = styledMsg({ text: 'bgBlueBright' });
export const warningMsg = styledMsg({
  text: ['yellow', 'italic'],
  values: ['yellowBright', 'italic'],
});
export const errorMsg = styledMsg({
  text: ['red', 'bold', 'italic'],
  values: ['yellow', 'italic'],
});

/**
 * @param {string} message
 * @returns {void}
 */
export const log = (message: string): void => {
  console.log(message);
};

export const logDebug = (...args: unknown[]) =>
  console.log(ansi.bgYellow(), ansi.black(), ' ~~~~ ', ...args, ansi.reset());
