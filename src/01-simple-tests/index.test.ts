import { Action, simpleCalculator } from './index';

describe('simpleCalculator tests', () => {
  type CalcInput = Parameters<typeof simpleCalculator>[0];

  test('should add two numbers', () => {
    expect(simpleCalculator({ a: 5, b: 6, action: Action.Add })).toBe(11);
    expect(simpleCalculator({ a: -10, b: 5, action: Action.Add })).toBe(-5);
    expect(simpleCalculator({ a: 12, b: -8, action: Action.Add })).toBe(4);
    expect(simpleCalculator({ a: -10, b: -5, action: Action.Add })).toBe(-15);
  });

  test('should subtract two numbers', () => {
    expect(simpleCalculator({ a: 10, b: 30, action: Action.Subtract })).toBe(
      -20,
    );
    expect(simpleCalculator({ a: 50, b: -30, action: Action.Subtract })).toBe(
      80,
    );
    expect(simpleCalculator({ a: -100, b: 30, action: Action.Subtract })).toBe(
      -130,
    );
    expect(simpleCalculator({ a: -8, b: -10, action: Action.Subtract })).toBe(
      2,
    );
  });

  test('should multiply two numbers', () => {
    expect(simpleCalculator({ a: 7, b: 2, action: Action.Multiply })).toBe(14);
    expect(simpleCalculator({ a: -4, b: 3, action: Action.Multiply })).toBe(
      -12,
    );
    expect(simpleCalculator({ a: 5, b: -8, action: Action.Multiply })).toBe(
      -40,
    );
    expect(simpleCalculator({ a: -3, b: -5, action: Action.Multiply })).toBe(
      15,
    );
  });

  test('should divide two numbers', () => {
    expect(simpleCalculator({ a: 7, b: 2, action: Action.Divide })).toBe(3.5);
    expect(simpleCalculator({ a: 4, b: -10, action: Action.Divide })).toBe(
      -0.4,
    );
    expect(simpleCalculator({ a: -30, b: 15, action: Action.Divide })).toBe(-2);
    expect(simpleCalculator({ a: -5, b: -0.5, action: Action.Divide })).toBe(
      10,
    );
  });

  test('should exponentiate two numbers', () => {
    expect(simpleCalculator({ a: 2, b: 3, action: Action.Exponentiate })).toBe(
      8,
    );
    expect(simpleCalculator({ a: -4, b: 3, action: Action.Exponentiate })).toBe(
      -64,
    );
    expect(simpleCalculator({ a: 2, b: -2, action: Action.Exponentiate })).toBe(
      0.25,
    );
    expect(
      simpleCalculator({ a: -2, b: -2, action: Action.Exponentiate }),
    ).toBe(0.25);
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: -2, b: -2, action: undefined })).toBe(null);
    expect(simpleCalculator({ a: -2, b: -2, action: null })).toBe(null);
    expect(
      simpleCalculator({ a: -2, b: -2, action: 'not-a-predefined-action' }),
    ).toBe(null);
  });

  test('should return null for invalid arguments', () => {
    expect(simpleCalculator({} as CalcInput)).toBe(null);
    expect(simpleCalculator({ a: -4 } as CalcInput)).toBe(null);
    expect(simpleCalculator({ a: 'not-a-number' } as CalcInput)).toBe(null);
    expect(simpleCalculator({ b: -2 } as CalcInput)).toBe(null);
    expect(simpleCalculator({ b: 'not-a-number' } as CalcInput)).toBe(null);
    expect(
      simpleCalculator({ a: 'not-a-number', b: 'not-a-number' } as CalcInput),
    ).toBe(null);
  });

  test('should throw an Error when no arguments provided', () => {
    expect(() => simpleCalculator(undefined as unknown as CalcInput)).toThrow(
      Error,
    );
  });
});
