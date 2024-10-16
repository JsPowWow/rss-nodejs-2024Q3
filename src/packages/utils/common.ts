import type { ConstructorOf, Nil, Nullable } from './types';

export function isNil<T>(value: Nullable<T>): value is Nil {
  return value === null || value === undefined;
}

export function isSome<T>(value: unknown): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isSomeFn<Fn extends (...args: unknown[]) => unknown>(
  value: unknown,
): value is NonNullable<Fn> {
  return isSome<Fn>(value) && typeof value === 'function';
}

export function assertIsNonNullable<T>(
  value: unknown,
  ...infos: Array<unknown>
): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    const messageText =
      infos.length > 0
        ? `${infos?.join(' ')}`
        : `Nullish assertion Error: "${String(value)}"; ${infos?.join(' ')}`;
    throw new Error(messageText);
  }
}

export function assertIsInstanceOf<T>(
  elemType: ConstructorOf<T>,
  value: unknown,
): asserts value is T {
  assertIsNonNullable(value, `#${String(elemType)}`);
  if (!(value instanceof elemType)) {
    throw new Error(
      `Not expected value: ${String(value)} of type: "${String(elemType)}"`,
    );
  }
}

export function isInstanceOf<T>(
  elemType: ConstructorOf<T>,
  value: unknown,
): value is T {
  return value instanceof elemType;
}

export const exhaustiveGuard = (_: never): never => {
  throw new Error(`Not expected value: "${String(_)}"`);
};

export const noop = (..._: unknown[]): undefined => {
  /** This is intentional */
};

export const identity = <T>(source: T): T => source;

export function sleep(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}
