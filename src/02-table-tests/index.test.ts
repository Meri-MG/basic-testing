import {  simpleCalculator, Action } from './index';

const testCases = [
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 2, b: 2, action: Action.Subtract, expected: 0 },
    { a: 3, b: 2, action: Action.Multiply, expected: 6 },
    { a: 4, b: 2, action: Action.Divide, expected: 2 },
    { a: 3, b: 2, action: Action.Exponentiate, expected: 9 },
    { a: '3', b: 2, action: Action.Exponentiate, expected: null },
    { a: 3, b: 2, action: 'invalid', expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)('should return $expected for $a $action $b', ({ a, b, action, expected }) => {
    const result = simpleCalculator({ a, b, action });
    expect(result).toBe(expected);
  });
});
