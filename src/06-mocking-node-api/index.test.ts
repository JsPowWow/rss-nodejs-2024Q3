import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';
import path from 'path';
import fs from 'node:fs';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeoutSpy = jest
      .spyOn(global, 'setTimeout')
      .mockName('The "setTimeout"');
    doStuffByTimeout(callback, 2000);
    expect(timeoutSpy).toHaveBeenCalledTimes(1);
    expect(timeoutSpy).toHaveBeenCalledWith(callback, 2000);
    timeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 2000);
    jest.advanceTimersByTime(1900);
    expect(callback).not.toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const intervalSpy = jest
      .spyOn(global, 'setInterval')
      .mockName('The "setInterval"');
    doStuffByInterval(callback, 2000);
    expect(intervalSpy).toHaveBeenCalledTimes(1);
    expect(intervalSpy).toHaveBeenCalledWith(callback, 2000);
    intervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 2000);
    jest.advanceTimersByTime(1900);
    expect(callback).not.toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(6000);
    expect(callback).toHaveBeenCalledTimes(4);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join').mockName('The "path.join"');
    const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    await readFileAsynchronously('some file');
    expect(joinSpy).toHaveBeenCalledTimes(1);
    expect(joinSpy).toHaveBeenCalledWith(expect.any(String), 'some file');
    joinSpy.mockRestore();
    existsSpy.mockRestore();
  });

  test('should return null if file does not exist', async () => {
    const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const fileContent = await readFileAsynchronously('not-existed-file');
    expect(fileContent).toBeNull();
    existsSpy.mockRestore();
  });

  test('should return file content if file exists', async () => {
    const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readFileSpy = jest
      .spyOn(fs.promises, 'readFile')
      .mockReturnValue(Promise.resolve('Test File content'));
    const fileContent = await readFileAsynchronously('some-file-with-content');
    expect(fileContent).toBe('Test File content');
    existsSpy.mockRestore();
    readFileSpy.mockRestore();
  });
});
