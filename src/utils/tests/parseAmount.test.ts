import { parseAmount } from '../parseAmount';

describe('parseAmount', () => {
  it.each([
    ['25000', 25000],
    ['25 000', 25000],
    ['R 25 000', 25000],
    ['25,000.50', 25000.5],
    ['0', 0],
  ])('parses "%s"', (input, expected) => {
    expect(parseAmount(input)).toBe(expected);
  });

  it.each(['', '   ', 'abc', '1.2.3'])('returns NaN for "%s"', (input) => {
    expect(parseAmount(input)).toBeNaN();
  });
});
