import os from 'node:os';
import { styleText } from 'node:util';

const concat =
  (str: string) =>
  (prevStr: string = '') =>
    prevStr ? `${prevStr}${str}` : str;

export const ansi = Object.freeze({
  reset: concat('\x1b[0m'),
  eol: concat(os.EOL),
  black: concat('\x1b[30m'),
  red: concat('\x1b[31m'),
  green: concat('\x1b[32m'),
  yellow: concat('\x1b[33m'),
  blue: concat('\x1b[34m'),
  magenta: concat('\x1b[35m'),
  cyan: concat('\x1b[36m'),
  white: concat('\x1b[37m'),
  grey: concat('\x1b[90m'),
  gray: concat('\x1b[90m'),
  brightRed: concat('\x1b[91m'),
  brightGreen: concat('\x1b[92m'),
  brightYellow: concat('\x1b[93m'),
  brightBlue: concat('\x1b[94m'),
  brightMagenta: concat('\x1b[95m'),
  brightCyan: concat('\x1b[96m'),
  brightWhite: concat('\x1b[97m'),
  bgBlack: concat('\x1b[40m'),
  bgRed: concat('\x1b[41m'),
  bgGreen: concat('\x1b[42m'),
  bgYellow: concat('\x1b[43m'),
  bgBlue: concat('\x1b[44m'),
  bgMagenta: concat('\x1b[45m'),
  bgCyan: concat('\x1b[46m'),
  bgWhite: concat('\x1b[47m'),
  bgGrey: concat('\x1b[100m'),
  bgGray: concat('\x1b[100m'),
  bgBrightRed: concat('\x1b[101m'),
  bgBrightGreen: concat('\x1b[102m'),
  bgBrightYellow: concat('\x1b[103m'),
  bgBrightBlue: concat('\x1b[104m'),
  bgBrightMagenta: concat('\x1b[105m'),
  bgBrightCyan: concat('\x1b[106m'),
  bgBrightWhite: concat('\x1b[107m'),
  rgb: (r: number, g: number, b: number) => concat(`\x1b[38;2;${r};${g};${b}m`),
  bgRgb: (r: number, g: number, b: number) =>
    concat(`\x1b[48;2;${r};${g};${b}m`),
});

export const styledMsg =
  (options: {
    text: Parameters<typeof styleText>[0];
    values?: Parameters<typeof styleText>[0];
  }) =>
  (strings: TemplateStringsArray, ...values: unknown[]) => {
    const formatText = options?.text ?? 'white';
    const formatValues = options?.values ?? formatText;
    let result = '';
    for (let i = 0; i < strings.length; i++) {
      result += styleText(formatText, String(strings[i] ?? ''));
      if (i < values.length) {
        result += styleText(formatValues, String(values[i] ?? ''));
      }
    }
    return result;
  };

// export const ttyMsg = (text: string, modifier?: ValueOf<keyof typeof ansi>) =>
//   concat(ansi ? `${modifier()}${text}` : text);

// /**
//  * @param {...(string)=>string} parts
//  * @return {void}
//  */
// export const logParts = (...parts) => {
//   pipeWith(null, ...parts, ansi.reset, console.log);
// };