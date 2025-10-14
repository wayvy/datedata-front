import { describe, it, expect } from 'vitest';

import { leadingZero } from './leading-zero';

describe('leadingZero', () => {
  it('should add leading zero for single digit numbers', () => {
    expect(leadingZero(1)).toBe('01');
    expect(leadingZero(2)).toBe('02');
    expect(leadingZero(3)).toBe('03');
    expect(leadingZero(4)).toBe('04');
    expect(leadingZero(5)).toBe('05');
    expect(leadingZero(6)).toBe('06');
    expect(leadingZero(7)).toBe('07');
    expect(leadingZero(8)).toBe('08');
    expect(leadingZero(9)).toBe('09');
  });

  it('should not add leading zero for double digit numbers', () => {
    expect(leadingZero(10)).toBe('10');
    expect(leadingZero(11)).toBe('11');
    expect(leadingZero(25)).toBe('25');
    expect(leadingZero(99)).toBe('99');
    expect(leadingZero(100)).toBe('100');
  });

  it('should not add leading zero for negative numbers', () => {
    expect(leadingZero(-1)).toBe('-1');
    expect(leadingZero(-5)).toBe('-5');
    expect(leadingZero(-10)).toBe('-10');
  });

  it('should handle edge cases', () => {
    expect(leadingZero(0)).toBe('0');
    expect(leadingZero(9)).toBe('09');
    expect(leadingZero(10)).toBe('10');
  });
});
