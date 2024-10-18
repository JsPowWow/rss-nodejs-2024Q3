/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyFunc = (...arg: any) => any;

type PipeArgs<F extends AnyFunc[], Acc extends AnyFunc[] = []> = F extends [(...args: infer A) => infer B]
  ? [...Acc, (...args: A) => B]
  : F extends [(...args: infer A) => any, ...infer Tail]
    ? Tail extends [(arg: infer B) => any, ...any[]]
      ? PipeArgs<Tail, [...Acc, (...args: A) => B]>
      : Acc
    : Acc;

type LastFnReturnType<F extends Array<AnyFunc>, Else = never> = F extends [...any[], (...arg: any) => infer R]
  ? R
  : Else;
/* eslint-enable @typescript-eslint/no-explicit-any */

export function pipe<FirstFn extends AnyFunc, F extends AnyFunc[]>(
  arg: Parameters<FirstFn>[0],
  firstFn: FirstFn,
  ...fns: PipeArgs<F> extends F ? F : PipeArgs<F>
): LastFnReturnType<F, ReturnType<FirstFn>> {
  return (fns as AnyFunc[]).reduce((acc, fn) => fn(acc), firstFn(arg));
}

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
