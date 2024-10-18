import { AnyFunc, tap, tapAsync } from './fp.ts';

describe('Tap()', () => {
  it('Should throw when invalid arguments are provided', () => {
    expect(() => tapAsync('test' as unknown as AnyFunc)).toThrow(TypeError);
    expect(() => tap('test' as unknown as AnyFunc)).toThrow(TypeError);
  });

  it('Sync: Runs as expected', () => {
    const left = 1;
    const right = 2;
    const add = jest.fn();
    add(left, right);
    expect(add.mock.calls).toHaveLength(1);
    expect(add.mock.calls[0][0]).toBe(left);
    expect(add.mock.calls[0][1]).toBe(right);
    const addTap = tap(add)(left, right);
    expect(add.mock.calls).toHaveLength(2);
    expect(addTap).toEqual([left, right]);
  });

  it('Sync: Throws correctly if the provided function does', () => {
    function profanityCheck(_input: unknown) {
      throw new Error('Test error!');
    }

    const profanityTap = tap(profanityCheck);

    try {
      profanityTap('hi');
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect((error as Error) instanceof Error).toBe(true);
      // eslint-disable-next-line jest/no-conditional-expect
      expect((error as Error).message).toMatch('Test error!');
    }
  });

  it('Async: Throws correctly if the provided function does', async () => {
    function profanityCheck(_input: unknown) {
      throw new Error('Test error!');
    }

    const profanityTap = tapAsync(profanityCheck);

    try {
      await profanityTap('hi');
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error instanceof Error).toBe(true);
      // eslint-disable-next-line jest/no-conditional-expect
      expect((error as Error).message).toMatch('Test error!');
    }
  });

  it('Async: Should call the input function when a value is provided', () => {
    const logger = jest.fn();
    const loggerTap = tapAsync(logger);
    const logValue = 'test log';
    loggerTap(logValue);
    expect(logger.mock.calls).toHaveLength(1);
    expect(logger.mock.calls[0][0]).toBe(logValue);
  });

  it('Async: Should be able to run as many times as necessary', () => {
    const logger = jest.fn();
    const loggerTap = tapAsync(logger);
    const logValue = 'test log';
    loggerTap(logValue);
    expect(logger.mock.calls).toHaveLength(1);
    expect(logger.mock.calls[0][0]).toBe(logValue);
    loggerTap(logValue + 1);
    expect(logger.mock.calls).toHaveLength(2);
    expect(logger.mock.calls[1][0]).toBe(logValue + 1);
  });

  it('Async: Should work with promise returning functions as input', async () => {
    const logger = jest.fn();
    const loggerAsync = (value: unknown) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(logger(value));
        }, 3000);
      });
    const loggerTap = tapAsync(loggerAsync);
    const logValue = 'test log';
    await loggerTap(logValue);
    expect(logger.mock.calls).toHaveLength(1);
    expect(logger.mock.calls[0][0]).toBe(logValue);
  });

  it('Async: Returns an array for multiple values', async () => {
    const left = 1;
    const right = 2;
    const add = jest.fn();
    add(left, right);
    expect(add.mock.calls).toHaveLength(1);
    expect(add.mock.calls[0][0]).toBe(left);
    expect(add.mock.calls[0][1]).toBe(right);
    const addTap = await tapAsync(add)(left, right);
    expect(add.mock.calls).toHaveLength(2);
    expect(addTap).toEqual([left, right]);
  });

  it('Async: Returns the input value if only one is provided', async () => {
    const name = 'James';
    const greet = jest.fn();
    greet(name);
    expect(greet.mock.calls).toHaveLength(1);
    expect(greet.mock.calls[0][0]).toBe(name);
    const greetTap = await tapAsync(greet)(name);
    expect(greet.mock.calls).toHaveLength(2);
    expect(greetTap).toEqual(name);
  });
});
