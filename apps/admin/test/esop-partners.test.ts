import { describe, it, expect } from 'vitest';
import { getInitials, getFullName, daysSince, needsNudge } from '@forhemit/shared/features/esop-partners/lib/formatters';
import type { PartnerContact } from '@forhemit/shared/features/esop-partners/types';

// Minimal mock contact
const mockContact = {
  first: 'Jane',
  last: 'Doe',
  email: 'jane@example.com',
  firm: 'Test Firm',
  type: 'Attorney',
  stage: 'active',
  preferred: false,
  states: ['NY'],
  createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
} as unknown as PartnerContact;

describe('getInitials', () => {
  it('returns initials for valid contact', () => {
    expect(getInitials(mockContact)).toBe('JD');
  });

  it('returns ?? for null contact', () => {
    expect(getInitials(null)).toBe('??');
  });

  it('returns ?? for missing names', () => {
    expect(getInitials({ first: '', last: '' } as PartnerContact)).toBe('??');
  });
});

describe('getFullName', () => {
  it('returns full name for valid contact', () => {
    expect(getFullName(mockContact)).toBe('Jane Doe');
  });

  it('returns Unknown for null contact', () => {
    expect(getFullName(null)).toBe('Unknown');
  });
});

describe('daysSince', () => {
  it('calculates days since date string', () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    const result = daysSince(tenDaysAgo);
    expect(result).toBeGreaterThanOrEqual(9);
    expect(result).toBeLessThanOrEqual(11);
  });

  it('returns 999 for null', () => {
    expect(daysSince(null)).toBe(999);
  });

  it('returns 999 for undefined', () => {
    expect(daysSince(undefined)).toBe(999);
  });
});

describe('needsNudge', () => {
  it('returns true for contact with no lastContact', () => {
    const noContact = { ...mockContact, lastContact: undefined } as unknown as PartnerContact;
    expect(needsNudge(noContact)).toBe(true);
  });

  it('returns false for recently contacted', () => {
    const recent = { ...mockContact, lastContact: new Date().toISOString() } as unknown as PartnerContact;
    expect(needsNudge(recent)).toBe(false);
  });
});
