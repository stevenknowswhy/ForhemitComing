#!/usr/bin/env tsx

/**
 * Standalone Email Payload Validator
 *
 * Run with: npx tsx test-email-payload.ts
 *
 * This script validates email payloads against the Convex schema
 * for sendBrokerIntroductionEmail.
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

interface ValidationResult {
  valid: boolean
  errors: string[]
}

function validatePayload(payload: EmailPayload): ValidationResult {
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

// ANSI color codes
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'

function runTests() {
  let passed = 0
  let failed = 0

  const tests: { name: string; payload: EmailPayload; expectValid: boolean }[] = [
    {
      name: 'Valid minimal payload',
      payload: {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
      },
      expectValid: true,
    },
    {
      name: 'Missing required field',
      payload: {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        // senderName is missing
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
      },
      expectValid: false,
    },
    {
      name: 'Invalid email format',
      payload: {
        brokerEmail: 'not-an-email',
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
      },
      expectValid: false,
    },
    {
      name: 'Valid payload with PDF',
      payload: {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
        introPdfBase64: 'data:application/pdf;base64,JVBERi0xLjQK...',
      },
      expectValid: true,
    },
    {
      name: 'Invalid PDF format (missing data URI prefix)',
      payload: {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
        introPdfBase64: 'JVBERi0xLjQK...',
      },
      expectValid: false,
    },
    {
      name: 'Old field name (pdfBase64 instead of introPdfBase64)',
      payload: {
        brokerEmail: 'test@example.com',
        brokerFirstName: 'John',
        senderName: 'Stefano Stokes',
        senderTitle: 'Founder',
        senderEmail: 'stefano.stokes@forhemit.com',
        senderPhone: '424-253-4019',
        pdfBase64: 'data:application/pdf;base64,JVBERi0xLjQK...',
      },
      expectValid: false,
    },
  ]

  console.log('\n🧪 Running Email Payload Validation Tests\n')
  console.log('=' .repeat(60))

  for (const test of tests) {
    const result = validatePayload(test.payload)
    const passedTest = result.valid === test.expectValid

    if (passedTest) {
      passed++
      console.log(`${GREEN}✓${RESET} ${test.name}`)
    } else {
      failed++
      console.log(`${RED}✗${RESET} ${test.name}`)
      console.log(`  Expected: ${test.expectValid ? 'valid' : 'invalid'}, Got: ${result.valid ? 'valid' : 'invalid'}`)
      if (result.errors.length > 0) {
        console.log(`  Errors:`)
        for (const error of result.errors) {
          console.log(`    - ${error}`)
        }
      }
    }
  }

  console.log('=' .repeat(60))
  console.log(`\nResults: ${GREEN}${passed} passed${RESET}, ${RED}${failed} failed${RESET}\n`)

  if (failed > 0) {
    process.exit(1)
  }
}

runTests()
