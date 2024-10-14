import { Action, simpleCalculator } from './index';

type TestCaseDescriptor = {
  a: unknown;
  b: unknown;
  action: unknown;
  expected: unknown;
};

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 5, b: 6, action: Action.Add, expected: 11 },
  { a: -10, b: 5, action: Action.Add, expected: -5 },
  { a: 12, b: -8, action: Action.Add, expected: 4 },
  { a: -10, b: -5, action: Action.Add, expected: -15 },
  { a: 10, b: 30, action: Action.Subtract, expected: -20 },
  { a: 50, b: -30, action: Action.Subtract, expected: 80 },
  { a: -100, b: 30, action: Action.Subtract, expected: -130 },
  { a: -8, b: -10, action: Action.Subtract, expected: 2 },
  { a: 7, b: 2, action: Action.Multiply, expected: 14 },
  { a: -4, b: 3, action: Action.Multiply, expected: -12 },
  { a: 5, b: -8, action: Action.Multiply, expected: -40 },
  { a: 7, b: 2, action: Action.Divide, expected: 3.5 },
  { a: 4, b: -10, action: Action.Divide, expected: -0.4 },
  { a: -30, b: 15, action: Action.Divide, expected: -2 },
  { a: -5, b: -0.5, action: Action.Divide, expected: 10 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: -4, b: 3, action: Action.Exponentiate, expected: -64 },
  { a: 2, b: -2, action: Action.Exponentiate, expected: 0.25 },
  { a: -2, b: -2, action: Action.Exponentiate, expected: 0.25 },
  { a: undefined, b: undefined, expected: null } as TestCaseDescriptor,
  { a: -2, b: -2, action: undefined, expected: null } as TestCaseDescriptor,
  { a: -2, b: -2, action: 'not-a-predefined-action', expected: null },
] satisfies Array<TestCaseDescriptor>;

describe('simpleCalculator', () => {
  test.each(testCases)(
    `should calculate correct '$a' '$b' using '$action'`,
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
