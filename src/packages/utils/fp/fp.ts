export type AnyFunc = (...arg: unknown[]) => unknown;

export const isFn = (value: unknown) => typeof value === 'function';

export function assertIsFunction(fn: unknown) {
  if (!isFn(fn)) {
    throw new TypeError(`Expect to have type of Function parameter to be provided, but got: "${typeof fn}".`);
  }
  return true;
}

export function tap(tapFn: AnyFunc) {
  assertIsFunction(tapFn);

  return function passThrough(...args: unknown[]) {
    tapFn(...args);
    return args.length === 1 ? args.shift() : [...args];
  };
}

export function tapAsync(tapFn: AnyFunc) {
  assertIsFunction(tapFn);

  return async function passThrough(...args: unknown[]) {
    await tapFn(...args);
    return args.length === 1 ? args.shift() : [...args];
  };
}
