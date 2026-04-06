#!/bin/bash

echo "========================================"
echo "Phase 2 Complete Installation"
echo "Code Quality & Cleanup"
echo "========================================"
echo ""

# Run Phase 2 installation
bash scripts/apply-phase2.sh

echo ""
echo "========================================"
echo "Post-Installation Verification"
echo "========================================"
echo ""

echo "Running type check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ Type check passed"
else
    echo "❌ Type check failed - review errors above"
    exit 1
fi

echo ""
echo "Running build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build succeeded"
else
    echo "❌ Build failed - review errors above"
    exit 1
fi

echo ""
echo "========================================"
echo "✅ Phase 2 Installation Complete!"
echo "========================================"
echo ""
echo "Manual verification needed:"
echo "1. Check /about page loads correctly"
echo "2. Check admin page phone numbers format correctly"
echo "3. Review any remaining 'as any' casts flagged above"
echo ""
echo "After verification, commit changes:"
echo "  git add ."
echo "  git commit -m 'refactor(cleanup): Phase 2 - remove dead code, consolidate utilities, optimize observer'"
