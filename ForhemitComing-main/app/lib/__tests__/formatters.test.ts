import { describe, it, expect } from 'vitest'
import { formatPhoneNumber } from '../formatters'

describe('formatPhoneNumber', () => {
  it('returns empty string for empty input', () => {
    expect(formatPhoneNumber('')).toBe('')
  })

  it('formats 10 digit number correctly', () => {
    expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567')
  })

  it('formats partial number with area code', () => {
    expect(formatPhoneNumber('555123')).toBe('(555) 123')
  })

  it('strips non-numeric characters', () => {
    expect(formatPhoneNumber('(555) 123-4567')).toBe('(555) 123-4567')
  })

  it('limits to 10 digits', () => {
    expect(formatPhoneNumber('5551234567890')).toBe('(555) 123-4567')
  })
})
