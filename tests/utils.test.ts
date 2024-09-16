import { isOffsetInPixels, createThreshold, isBrowser, getRootMargin, getProgressRootMargin } from '../src';
import { describe, it, expect } from 'vitest';

describe('isOffsetInPixels', () => {
  it('should return true for pixel offset', () => {
    expect(isOffsetInPixels('10px')).toBe(true);
  });

  it('should return true for decimal pixel offset', () => {
    expect(isOffsetInPixels('10.5px')).toBe(true);
  });

  it('should return false for non-pixel offset', () => {
    expect(isOffsetInPixels('10%')).toBe(false);
  });

  it('should return false for numeric offset', () => {
    expect(isOffsetInPixels(10)).toBe(false);
  });

  it('should return false for decimal numeric offset', () => {
    expect(isOffsetInPixels(10.5)).toBe(false);
  });
});

describe('createThreshold', () => {
  it('should create an array of thresholds', () => {
    const result = createThreshold(100, 1000);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(11); // 1000/100 rounded up + 1
  });

  it('should return thresholds between 0 and 1', () => {
    const result = createThreshold(50, 200);
    expect(result[0]).toBe(0);
    expect(result[result.length - 1]).toBe(1);
    result.forEach(threshold => {
      expect(threshold).toBeGreaterThanOrEqual(0);
      expect(threshold).toBeLessThanOrEqual(1);
    });
  });

  it('should handle edge case with small theta', () => {
    const result = createThreshold(1, 10);
    expect(result.length).toBe(11);
    expect(result[1]).toBeCloseTo(0.1, 5);
  });

  it('should handle edge case with theta larger than height', () => {
    const result = createThreshold(100, 50);
    expect(result.length).toBe(2);
    expect(result).toEqual([0, 1]);
  });
})



describe('isBrowser', () => {
  it('should return true when window and document are defined', () => {
    expect(isBrowser).toBe(true);
  });
});


describe('getRootMargin', () => {
  it('should return the correct root margin', () => {
    expect(getRootMargin({ offset: 0 })).toBe('0% 0px -100% 0px');
    expect(getRootMargin({ offset: 0.5 })).toBe('-50% 0px -50% 0px');
    expect(getRootMargin({ offset: 1 })).toBe('-100% 0px 0% 0px');
  });
});


describe('getProgressRootMargin', () => {
  it('should return "0px" when nodeOffsetHeight is null', () => {
    expect(getProgressRootMargin({ direction: 'down', offset: 0, nodeOffsetHeight: 0, innerHeight: 0 })).toBe('0px');
  });

  it('should return correct margin for downward scrolling', () => {
    const result = getProgressRootMargin({ direction: 'down', offset: 0.3, nodeOffsetHeight: 500, innerHeight: 1000 });
    expect(result).toBe('21% 0px -70% 0px');
  });

  it('should return correct margin for upward scrolling', () => {
    const result = getProgressRootMargin({ direction: 'up', offset: 0.3, nodeOffsetHeight: 500, innerHeight: 1000 });
    expect(result).toBe('21% 0px -70% 0px');
  });
});
