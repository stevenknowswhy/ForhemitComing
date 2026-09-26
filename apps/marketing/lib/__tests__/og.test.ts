import { describe, it, expect } from 'vitest'
import { ogMetadata } from '../og'

describe('ogMetadata', () => {
  const meta = ogMetadata({
    file: 'og-home.png',
    title: 'Forhemit | Home',
    description: 'Employee ownership succession.',
    path: '/',
  })
  // Next's OpenGraph/Twitter types are unions that omit fields on some
  // variants; the runtime object always carries them for this input.
  const og = meta.openGraph as Record<string, unknown>
  const twitter = meta.twitter as Record<string, unknown>

  it('points openGraph at the branded card with dimensions', () => {
    expect(og.images).toEqual([
      { url: '/og-home.png', width: 1200, height: 630, alt: 'Forhemit | Home' },
    ])
  })

  it('keeps site name, locale, type and canonical path', () => {
    expect(og.siteName).toBe('Forhemit PBC')
    expect(og.locale).toBe('en_US')
    expect(og.type).toBe('website')
    expect(og.url).toBe('/')
  })

  it('mirrors the card on the twitter summary_large_image card', () => {
    expect(twitter.card).toBe('summary_large_image')
    expect(twitter.images).toEqual(['/og-home.png'])
  })
})
