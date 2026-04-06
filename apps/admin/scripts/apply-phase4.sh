#!/bin/bash
set -e

echo "========================================"
echo "Phase 4 Auto-Installation Script"
echo "Testing & Observability"
echo "========================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Run from project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1/5: Installing testing dependencies...${NC}"
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

echo -e "${GREEN}✓ Testing dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 2/5: Creating Vitest configuration...${NC}"
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/app': path.resolve(__dirname, './app'),
      '@/lib': path.resolve(__dirname, './lib'),
    },
  },
})
EOF
echo -e "${GREEN}✓ vitest.config.ts created${NC}"
echo ""

echo -e "${YELLOW}Step 3/5: Creating test setup and utilities...${NC}"
mkdir -p test

cat > test/setup.ts << 'EOF'
import '@testing-library/jest-dom'
EOF

cat > test/utils.tsx << 'EOF'
import React, { ReactElement } from 'react'
import { render as rtlRender } from '@testing-library/react'

function render(ui: ReactElement, options = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => <>{children}</>,
    ...options,
  })
}

export * from '@testing-library/react'
export { render }
EOF
echo -e "${GREEN}✓ Test utilities created${NC}"
echo ""

echo -e "${YELLOW}Step 4/5: Creating first test...${NC}"
mkdir -p app/lib/__tests__

cat > app/lib/__tests__/formatters.test.ts << 'EOF'
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
EOF
echo -e "${GREEN}✓ First test created${NC}"
echo ""

echo -e "${YELLOW}Step 5/5: Creating health check endpoint...${NC}"
mkdir -p app/api/health

cat > app/api/health/route.ts << 'EOF'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
  }

  // Check Convex connection (optional - remove if not needed)
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) {
    return NextResponse.json(
      { ...checks, status: 'unhealthy', error: 'Missing Convex URL' },
      { status: 503 }
    )
  }

  return NextResponse.json(checks, { status: 200 })
}
EOF
echo -e "${GREEN}✓ Health check endpoint created${NC}"
echo ""

echo -e "${YELLOW}Step 6/5: Adding test script to package.json...${NC}"
node << 'NODE_SCRIPT'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

if (!pkg.scripts.test) {
    pkg.scripts.test = 'vitest';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    console.log('✓ Added test script to package.json');
} else {
    console.log('✓ Test script already exists');
}
NODE_SCRIPT

echo ""
echo "========================================"
echo -e "${GREEN}Phase 4 Base Installation Complete!${NC}"
echo "========================================"
echo ""
echo "Installed:"
echo "  ✓ Vitest testing framework"
echo "  ✓ React Testing Library"
echo "  ✓ Test utilities and setup"
echo "  ✓ Sample formatter tests"
echo "  ✓ Health check API endpoint"
echo ""
echo "Next steps:"
echo "1. Run tests: npm test"
echo "2. Check health endpoint: curl http://localhost:3000/api/health"
echo "3. Build: npm run build"
echo "4. (Optional) Install Sentry for error tracking:"
echo "   npm install @sentry/nextjs"
echo "   npx @sentry/wizard@latest -i nextjs"
echo ""
