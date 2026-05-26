import { describe, it, expect } from 'vitest';
import { formatDate, getStageMeta, getStageClass, getInitials, getFullName } from '@forhemit/shared/features/esop-partners/lib/formatters';
import type { PartnerContact } from '@forhemit/shared/features/esop-partners/types';

describe('formatDate', () => {
  it('returns — for null', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('returns — for undefined', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('formats valid date string', () => {
    const result = formatDate('2025-01-15');
    expect(result).toContain('01');
    expect(result).toContain('15');
    expect(result).toContain('2025');
  });

  it('handles invalid date string gracefully', () => {
    expect(formatDate('invalid')).toBe('—');
  });
});

describe('getStageMeta', () => {
  it('returns label for known stage', () => {
    const meta = getStageMeta('prospect');
    expect(meta.label).toBe('Prospect');
    expect(typeof meta.score).toBe('number');
  });

  it('returns meta for active stage', () => {
    const meta = getStageMeta('active');
    expect(meta.label).toBe('Active partner');
  });

  it('falls back to prospect for unknown stage', () => {
    const meta = getStageMeta('unknown');
    expect(meta.label).toBe('Prospect');
  });
});

describe('getStageClass', () => {
  it('returns class for prospect', () => {
    expect(getStageClass('prospect')).toContain('amber');
  });

  it('returns class for active', () => {
    expect(getStageClass('active')).toContain('green');
  });

  it('returns class for dormant', () => {
    expect(getStageClass('dormant')).toContain('red');
  });
});

describe('getInitials edge cases', () => {
  it('handles single-character names', () => {
    const contact = { first: 'A', last: 'B' } as unknown as PartnerContact;
    expect(getInitials(contact)).toBe('AB');
  });

  it('handles lowercase names', () => {
    const contact = { first: 'john', last: 'doe' } as unknown as PartnerContact;
    expect(getInitials(contact)).toBe('JD');
  });
});

describe('getFullName edge cases', () => {
  it('handles empty first name', () => {
    const contact = { first: '', last: 'Doe' } as unknown as PartnerContact;
    expect(getFullName(contact)).toBe('Unknown');
  });

  it('handles empty last name', () => {
    const contact = { first: 'Jane', last: '' } as unknown as PartnerContact;
    expect(getFullName(contact)).toBe('Unknown');
  });
});
