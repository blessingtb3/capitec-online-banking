import { addDays, addMonths, daysBetweenInclusive, isValidIsoDate } from '../dates';

describe('dates', () => {
  it('adds days across month boundaries', () => {
    expect(addDays('2024-09-16', -6)).toBe('2024-09-10');
    expect(addDays('2024-03-01', -1)).toBe('2024-02-29');
  });

  it('adds months, clamping to the end of shorter months', () => {
    expect(addMonths('2024-09-16', -1)).toBe('2024-08-16');
    expect(addMonths('2024-03-31', -1)).toBe('2024-02-29');
    expect(addMonths('2024-09-16', -12)).toBe('2023-09-16');
  });

  it('counts days inclusively', () => {
    expect(daysBetweenInclusive('2024-09-10', '2024-09-16')).toBe(7);
  });

  it('validates ISO dates', () => {
    expect(isValidIsoDate('2024-02-29')).toBe(true);
    expect(isValidIsoDate('2023-02-29')).toBe(false);
    expect(isValidIsoDate('16/09/2024')).toBe(false);
  });
});
