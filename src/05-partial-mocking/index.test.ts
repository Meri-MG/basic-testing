
import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule = jest.requireActual<typeof import('./index')>('./index');
  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  let consoleSpy: jest.SpyInstance;

  afterAll(() => {
    jest.unmock('./index');
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {  
    mockOne();
    expect(jest.isMockFunction(mockOne)).toBe(true);
    expect(mockOne).toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalledWith('foo')

    mockTwo();
    expect(jest.isMockFunction(mockTwo)).toBe(true);
    expect(mockTwo).toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalledWith('bar')

    mockThree();
    expect(jest.isMockFunction(mockThree)).toBe(true);
    expect(mockThree).toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalledWith('baz');

  });

  test('unmockedFunction should log into console', () => {
    unmockedFunction();
    expect(jest.isMockFunction(unmockedFunction)).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('I am not mocked');
  });
});
