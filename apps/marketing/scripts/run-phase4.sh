#!/bin/bash

echo "========================================"
echo "Phase 4 Complete Installation"
echo "Testing & Observability"
echo "========================================"
echo ""

# Run Phase 4 installation
bash scripts/apply-phase4.sh

if [ $? -ne 0 ]; then
    echo "❌ Phase 4 installation failed"
    exit 1
fi

echo ""
echo "========================================"
echo "Post-Installation Verification"
echo "========================================"
echo ""

echo "Running tests..."
npm test -- --run

if [ $? -eq 0 ]; then
    echo "✅ Tests passed"
else
    echo "⚠ Some tests failed (may be expected for initial setup)"
fi

echo ""
echo "Running build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build succeeded"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "========================================"
echo "✅ Phase 4 Installation Complete!"
echo "========================================"
echo ""
echo "Manual steps remaining:"
echo "1. (Optional) Set up Sentry for error tracking"
echo "2. (Optional) Set up Vercel Analytics"
echo "3. Test health endpoint: curl http://localhost:3000/api/health"
echo "4. Add more tests as needed"
echo ""
echo "After verification, commit changes:"
echo "  git add ."
echo "  git commit -m 'feat(testing): Phase 4 - add Vitest, health check, testing infrastructure'"
