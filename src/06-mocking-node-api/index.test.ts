import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'path';
jest.mock('fs/promises');
jest.mock('fs');
import { existsSync } from 'fs';
const fs = require('fs/promises');


describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const setTimeout = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    const timeout = 1000;
    doStuffByTimeout(callback, timeout);

    expect(setTimeout).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    expect(callback).not.toHaveBeenCalled();

    doStuffByTimeout(callback, timeout);
    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
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
    const setInterval = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const interval = 1000;
    doStuffByInterval(callback, interval);
  
    expect(setInterval).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const setInterval = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(3);

    expect(setInterval).toHaveBeenCalledWith(callback, interval);
    expect(setInterval).toHaveBeenCalledTimes(1);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const file = 'some/path/file.txt';
    const joinSpy = jest.spyOn(path, 'join');
    (existsSync as jest.Mock).mockReturnValue(true);
    fs.readFile.mockResolvedValue('dummy');

    await readFileAsynchronously(file);

    expect(fs.readFile).toHaveBeenCalled();
    expect(joinSpy).toHaveBeenCalledWith(__dirname, file);

    joinSpy.mockRestore();
});

  test('should return null if file does not exist', async () => {
    const file = 'some/path/file.txt';
    const joinSpy = jest.spyOn(path, 'join');
    (existsSync as jest.Mock).mockReturnValue(false);
    fs.readFile.mockResolvedValue('dummy');
    const result = await readFileAsynchronously(file);

    expect(joinSpy).toHaveBeenCalledWith(__dirname, file);
    expect(result).toBeNull();
    expect(fs.readFile).not.toHaveBeenCalled();

    joinSpy.mockRestore();
  });

  test('should return file content if file exists', async () => {
    const content = "Some content";
    (existsSync as jest.Mock).mockReturnValue(true);
    fs.readFile.mockResolvedValue(Buffer.from(content));
  
    const result = await readFileAsynchronously("File.txt");
  
    expect(result).toBe(content);
  });
});
