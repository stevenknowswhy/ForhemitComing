'use client'

import { useEffect } from 'react'

export function WebMCP() {
  useEffect(() => {
    try {
      const api = (navigator as any).modelContext
      if (api?.registerTool) {
        api.registerTool({
          name: 'get_page_content',
          description: 'Retrieve content from Forhemit pages',
          parameters: { path: { type: 'string', description: 'URL path' } },
        })
        api.registerTool({
          name: 'get_site_info',
          description: 'Get information about Forhemit services',
          parameters: {},
        })
      }
    } catch {
      // WebMCP not available
    }
  }, [])

  return null
}
