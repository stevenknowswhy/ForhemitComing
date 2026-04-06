import { describe, it, expect } from 'vitest'

/**
 * Email Payload Validation Tests
 *
 * These tests validate that the payload structure sent to Convex
 * matches the expected schema for sendBrokerIntroductionEmail.
 *
 * This is useful for catching validation errors before runtime.
 */

// Required fields according to Convex schema
const REQUIRED_FIELDS = [
  'brokerEmail',
  'brokerFirstName',
  'senderName',
  'senderTitle',
  'senderEmail',
  'senderPhone',
] as const

// Optional fields according to Convex schema
const OPTIONAL_FIELDS = [
  'brokerLastName',
  'brokerFirm',
  'brokerMarket',
  'dealRef',
  'introPdfBase64',
  'tearSheetPdfBase64',
  'subject',
  'customMessage',
] as const

// All valid fields
const VALID_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS] as const

type EmailPayload = Record<string, unknown>

function validatePayload(payload: EmailPayload): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in payload)) {
      errors.push(`Missing required field: ${field}`)
    } else if (typeof payload[field] !== 'string') {
      errors.push(`Field ${field} must be a string`)
    } else if (payload[field] === '') {
      errors.push(`Field ${field} cannot be empty`)
    }
  }

  // Validate email format
  if (payload.brokerEmail && typeof payload.brokerEmail === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(payload.brokerEmail)) {
      errors.push('brokerEmail must be a valid email address')
    }
  }

  // Validate PDF base64 format if provided
  const pdfFields = ['introPdfBase64', 'tearSheetPdfBase64']
  for (const field of pdfFields) {
    if (field in payload && payload[field]) {
      const value = payload[field] as string
      if (typeof value !== 'string') {
        errors.push(`${field} must be a string`)
      } else if (!value.startsWith('data:application/pdf;base64,')) {
        errors.push(`${field} must start with 'data:application/pdf;base64,'`)
      }
    }
  }

  // Check for unknown fields
  for (const field of Object.keys(payload)) {
    if (!(VALID_FIELDS as readonly string[]).includes(field)) {
      errors.push(`Unknown field: ${field}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

describe('Email Payload Validation', () => {
  describe('Required Fields', () => {
    it('accepts a valid minimal payload', () => {
      const payload = {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
      }

      const result = validatePayload(payload)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('rejects payload with missing required field', () => {
      const payload = {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        // Missing senderName
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
      }

      const result = validatePayload(payload)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Missing required field: senderName')
    })

    it('rejects payload with empty required field', () => {
      const payload = {
        brokerEmail: '', // Empty
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
      }

      const result = validatePayload(payload)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Field brokerEmail cannot be empty')
    })
  })

  describe('Email Validation', () => {
    it('accepts valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user-name@subdomain.example.com',
      ]

      for (const email of validEmails) {
        const payload = {
          brokerEmail: email,
          brokerFirstName: 'John',
          senderName: 'Stefano Stokes',
          senderTitle: 'Founder',
          senderEmail: 'stefano.stokes@forhemit.com',
          senderPhone: '424-253-4019',
        }

        const result = validatePayload(payload)
        expect(result.errors.some(e => e.includes('brokerEmail must be a valid email'))).toBe(false)
      }
    })

    it('rejects invalid email formats', () => {
      const invalidEmails = [
        'not-an-email',
        '@example.com',
        'user@',
        'user @example.com',
      ]

      for (const email of invalidEmails) {
        const payload = {
          brokerEmail: email,
          brokerFirstName: 'John',
          senderName: 'Stefano Stokes',
          senderTitle: 'Founder',
          senderEmail: 'stefano.stokes@forhemit.com',
          senderPhone: '424-253-4019',
        }

        const result = validatePayload(payload)
        expect(result.errors).toContain('brokerEmail must be a valid email address')
      }
    })
  })

  describe('PDF Base64 Validation', () => {
    it('accepts valid PDF base64 format', () => {
      const payload = {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
        introPdfBase64: 'data:application/pdf;base64,JVBERi0xLjQK...',
      }

      const result = validatePayload(payload)
      expect(result.valid).toBe(true)
    })

    it('rejects PDF without data URI prefix', () => {
      const payload = {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
        introPdfBase64: 'JVBERi0xLjQK...', // Missing data URI prefix
      }

      const result = validatePayload(payload)
      expect(result.errors).toContain('introPdfBase64 must start with \'data:application/pdf;base64,\'')
    })
  })

  describe('Optional Fields', () => {
    it('accepts payload with all optional fields', () => {
      const payload = {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        brokerLastName: 'Doe',
        brokerFirm: 'Test Firm',
        brokerMarket: 'Florida',
        dealRef: 'DEAL-001',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
        subject: 'Test Subject',
        customMessage: 'Test message',
        introPdfBase64: 'data:application/pdf;base64,JVBERi0xLjQK...',
        tearSheetPdfBase64: 'data:application/pdf;base64,JVBERi0xLjQK...',
      }

      const result = validatePayload(payload)
      expect(result.valid).toBe(true)
    })

    it('accepts payload without optional fields', () => {
      const minimalPayload = {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
      }

      const result = validatePayload(minimalPayload)
      expect(result.valid).toBe(true)
    })
  })

  describe('Unknown Fields', () => {
    it('rejects payload with unknown fields', () => {
      const payload = {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
        pdfBase64: 'data:application/pdf;base64,JVBERi0xLjQK...', // OLD FIELD NAME - should cause error
      }

      const result = validatePayload(payload)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Unknown field: pdfBase64')
    })

    it('highlights the old vs new field name issue', () => {
      // This test documents the bug that was fixed:
      // Old schema used: pdfBase64
      // New schema uses: introPdfBase64, tearSheetPdfBase64
      const oldPayload = {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
        pdfBase64: 'data:application/pdf;base64,JVBERi0xLjQK...',
      }

      const newPayload = {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
        introPdfBase64: 'data:application/pdf;base64,JVBERi0xLjQK...',
      }

      const oldResult = validatePayload(oldPayload)
      const newResult = validatePayload(newPayload)

      expect(oldResult.valid).toBe(false)
      expect(newResult.valid).toBe(true)
    })
  })
})

/**
 * Schema Documentation
 *
 * This test serves as documentation for the expected schema.
 * Update this when the Convex function schema changes.
 */
describe('Schema Documentation', () => {
  it('documents all required fields', () => {
    expect(REQUIRED_FIELDS).toEqual([
      'brokerEmail',
      'brokerFirstName',
      'senderName',
      'senderTitle',
      'senderEmail',
      'senderPhone',
    ])
  })

  it('documents all optional fields', () => {
    expect(OPTIONAL_FIELDS).toEqual([
      'brokerLastName',
      'brokerFirm',
      'brokerMarket',
      'dealRef',
      'introPdfBase64',
      'tearSheetPdfBase64',
      'subject',
      'customMessage',
    ])
  })
})
