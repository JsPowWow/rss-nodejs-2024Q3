import {
  MyAwesomeError,
  rejectCustomError,
  resolveValue,
  throwCustomError,
  throwError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    expect(await resolveValue('test-value')).toBe('test-value');
    expect(await resolveValue(42)).toBe(42);
    expect(await resolveValue(Promise.resolve('The value'))).toBe('The value');
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    expect(() => throwError('Something goes wrong')).toThrow(
      'Something goes wrong',
    );
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    expect.assertions(2);
    const expected: { err?: Error } = {};

    await rejectCustomError().catch((err) => {
      Object.assign(expected, { err });
    });

    expect(expected.err).toBeInstanceOf(MyAwesomeError);
    expect(expected.err?.message).toBe('This is my awesome custom error!');
  });
});
