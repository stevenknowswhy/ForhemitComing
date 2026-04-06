import { describe, it, expect } from 'vitest'
import { 
  emailSchema, 
  phoneSchema, 
  contactFormSchema, 
  earlyAccessSchema,
  jobApplicationSchema 
} from '../validation'

describe('emailSchema', () => {
  it('validates correct email', () => {
    expect(emailSchema.safeParse('test@example.com').success).toBe(true)
  })

  it('rejects email without @', () => {
    expect(emailSchema.safeParse('testexample.com').success).toBe(false)
  })

  it('rejects email without domain', () => {
    expect(emailSchema.safeParse('test@').success).toBe(false)
  })

  it('rejects empty email', () => {
    expect(emailSchema.safeParse('').success).toBe(false)
  })

  it('rejects email over 255 characters', () => {
    const longEmail = 'a'.repeat(250) + '@test.com'
    expect(emailSchema.safeParse(longEmail).success).toBe(false)
  })
})

describe('phoneSchema', () => {
  it('validates 10 digit phone number', () => {
    expect(phoneSchema.safeParse('5551234567').success).toBe(true)
  })

  it('validates empty string', () => {
    expect(phoneSchema.safeParse('').success).toBe(true)
  })

  it('validates undefined', () => {
    expect(phoneSchema.safeParse(undefined).success).toBe(true)
  })

  it('rejects phone with less than 10 digits', () => {
    expect(phoneSchema.safeParse('555123456').success).toBe(false)
  })

  it('rejects phone with more than 10 digits', () => {
    expect(phoneSchema.safeParse('55512345678').success).toBe(false)
  })

  it('rejects phone with letters', () => {
    expect(phoneSchema.safeParse('555-ABC-1234').success).toBe(false)
  })
})

describe('contactFormSchema', () => {
  const validData = {
    contactType: 'business-owner',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '5551234567',
    company: 'Acme Inc',
    interest: 'esop-transition',
    message: 'Hello, I am interested in learning more.'
  }

  it('validates correct contact form data', () => {
    expect(contactFormSchema.safeParse(validData).success).toBe(true)
  })

  it('validates without optional fields', () => {
    const { company, interest, ...required } = validData
    expect(contactFormSchema.safeParse(required).success).toBe(true)
  })

  it('rejects invalid contact type', () => {
    const data = { ...validData, contactType: 'invalid' }
    expect(contactFormSchema.safeParse(data).success).toBe(false)
  })

  it('rejects empty first name', () => {
    const data = { ...validData, firstName: '' }
    expect(contactFormSchema.safeParse(data).success).toBe(false)
  })

  it('rejects empty message', () => {
    const data = { ...validData, message: '' }
    expect(contactFormSchema.safeParse(data).success).toBe(false)
  })

  it('rejects message over 5000 characters', () => {
    const data = { ...validData, message: 'a'.repeat(5001) }
    expect(contactFormSchema.safeParse(data).success).toBe(false)
  })
})

describe('earlyAccessSchema', () => {
  it('validates correct email', () => {
    expect(earlyAccessSchema.safeParse({ email: 'test@example.com' }).success).toBe(true)
  })

  it('rejects invalid email', () => {
    expect(earlyAccessSchema.safeParse({ email: 'invalid' }).success).toBe(false)
  })
})

describe('jobApplicationSchema', () => {
  const validData = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '5551234567',
    position: 'Analyst'
  }

  it('validates correct job application', () => {
    expect(jobApplicationSchema.safeParse(validData).success).toBe(true)
  })

  it('validates with otherPosition', () => {
    const data = { ...validData, position: 'Other', otherPosition: 'Custom Role' }
    expect(jobApplicationSchema.safeParse(data).success).toBe(true)
  })

  it('rejects empty position', () => {
    const data = { ...validData, position: '' }
    expect(jobApplicationSchema.safeParse(data).success).toBe(false)
  })

  it('rejects invalid phone format', () => {
    const data = { ...validData, phone: '123' }
    expect(jobApplicationSchema.safeParse(data).success).toBe(false)
  })
})
