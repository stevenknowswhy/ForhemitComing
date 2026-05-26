import { describe, it, expect } from 'vitest';
import { filterContacts, sortContacts } from '@forhemit/shared/features/esop-partners/lib/calculations';
import type { PartnerContact } from '@forhemit/shared/features/esop-partners/types';

const contacts = [
  { first: 'Alice', last: 'Smith', email: 'alice@test.com', firm: 'Alpha', type: 'Attorney', stage: 'active', preferred: true, states: ['NY'], lastContact: new Date().toISOString() },
  { first: 'Bob', last: 'Jones', email: 'bob@test.com', firm: 'Beta', type: 'Banker', stage: 'prospect', preferred: false, states: ['CA'], lastContact: '2020-01-01' },
  { first: 'Carol', last: 'White', email: 'carol@test.com', firm: 'Gamma', type: 'Accountant', stage: 'dormant', preferred: false, states: ['TX'], lastContact: undefined },
] as unknown as PartnerContact[];

describe('filterContacts', () => {
  it('returns all contacts with no filters', () => {
    expect(filterContacts(contacts, {})).toHaveLength(3);
  });

  it('filters by type', () => {
    expect(filterContacts(contacts, { type: 'Attorney' })).toHaveLength(1);
  });

  it('filters by preferred view', () => {
    expect(filterContacts(contacts, { view: 'preferred' })).toHaveLength(1);
  });

  it('filters by search query', () => {
    expect(filterContacts(contacts, { searchQuery: 'Alpha' })).toHaveLength(1);
  });

  it('filters by nudges view', () => {
    const result = filterContacts(contacts, { view: 'nudges' });
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('handles null contacts gracefully', () => {
    const withNull = [contacts[0], null, contacts[1]] as unknown as PartnerContact[];
    expect(filterContacts(withNull, {})).toHaveLength(2);
  });

  it('search is case-insensitive', () => {
    expect(filterContacts(contacts, { searchQuery: 'alice' })).toHaveLength(1);
  });

  it('search matches email', () => {
    expect(filterContacts(contacts, { searchQuery: 'bob@test' })).toHaveLength(1);
  });

  it('search matches states', () => {
    expect(filterContacts(contacts, { searchQuery: 'TX' })).toHaveLength(1);
  });
});

describe('sortContacts', () => {
  it('returns unsorted when no field', () => {
    const result = sortContacts(contacts, { field: null, dir: 'asc' });
    expect(result[0].first).toBe('Alice');
  });

  it('sorts by name ascending', () => {
    const result = sortContacts(contacts, { field: 'name', dir: 'asc' });
    expect(result[0].first).toBe('Alice');
    expect(result[2].first).toBe('Carol');
  });

  it('sorts by name descending', () => {
    const result = sortContacts(contacts, { field: 'name', dir: 'desc' });
    expect(result[0].first).toBe('Carol');
  });

  it('sorts by firm', () => {
    const result = sortContacts(contacts, { field: 'firm', dir: 'asc' });
    expect(result[0].firm).toBe('Alpha');
  });

  it('sorts by type', () => {
    const result = sortContacts(contacts, { field: 'type', dir: 'asc' });
    expect(result[0].type).toBe('Accountant');
  });
});
