#!/bin/bash

echo "========================================"
echo "Phase 1 Complete Installation"
echo "========================================"
echo ""

# Check if we're in project root
if [ ! -f "package.json" ]; then
    echo "Error: Run from project root directory"
    exit 1
fi

# Run base installation
echo "📦 Running base installation..."
bash scripts/apply-phase1.sh

if [ $? -ne 0 ]; then
    echo "❌ Base installation failed"
    exit 1
fi

echo ""
echo "🔧 Applying manual fixes..."
node scripts/apply-phase1-manual-fixes.js

if [ $? -ne 0 ]; then
    echo "❌ Manual fixes failed"
    exit 1
fi

echo ""
echo "========================================"
echo "✅ Phase 1 Installation Complete!"
echo "========================================"
echo ""
echo "Verification steps:"
echo "1. npm run build"
echo "2. npx tsc --noEmit"
echo "3. npm run dev"
echo "4. Test error boundary (add throw new Error('test') to any page temporarily)"
echo "5. Test contact form submission"
echo "6. Test early access form"
echo ""
echo "After verification, commit changes:"
echo "  git add ."
echo "  git commit -m 'feat(security): Phase 1 - error boundaries, XSS fix, memory leak fixes'"
