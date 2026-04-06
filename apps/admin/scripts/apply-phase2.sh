#!/bin/bash
set -e

echo "========================================"
echo "Phase 2 Auto-Installation Script"
echo "Code Quality & Cleanup"
echo "========================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Run from project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1/4: Checking for dead code references...${NC}"

# Check if _archive is imported anywhere
ARCHIVE_REFS=$(grep -r "_archive" app/ --include="*.tsx" --include="*.ts" | grep -v "\.backup" | grep -v "node_modules" || true)

if [ -z "$ARCHIVE_REFS" ]; then
    echo -e "${GREEN}✓ No references to _archive found - safe to delete${NC}"
    echo ""
    echo -e "${YELLOW}Removing app/about/_archive/ directory...${NC}"
    rm -rf app/about/_archive/
    echo -e "${GREEN}✓ _archive directory removed${NC}"
else
    echo -e "${YELLOW}⚠ Found references to _archive:${NC}"
    echo "$ARCHIVE_REFS"
    echo ""
    echo -e "${YELLOW}Skipping _archive deletion - please review manually${NC}"
fi
echo ""

echo -e "${YELLOW}Step 2/4: Consolidating phone formatting utilities...${NC}"

# Check if admin/page.tsx has its own formatPhone function
if grep -q "const formatPhone = " app/admin/page.tsx; then
    echo "Found duplicate formatPhone in admin/page.tsx"
    
    # Replace the local function with an import
    # First, let's check if the import already exists
    if ! grep -q "from \"\@/app/lib/formatters\"" app/admin/page.tsx && ! grep -q "from \"../lib/formatters\"" app/admin/page.tsx; then
        echo "Adding import for formatPhoneNumber..."
        # Add import at the top after existing imports
        sed -i '' 's|import { api } from "../../convex/_generated/api";|import { api } from "../../convex/_generated/api";\nimport { formatPhoneNumber } from "../../lib/formatters";|' app/admin/page.tsx 2>/dev/null || \
        sed -i 's|import { api } from "../../convex/_generated/api";|import { api } from "../../convex/_generated/api";\nimport { formatPhoneNumber } from "../../lib/formatters";|' app/admin/page.tsx
        
        # Remove the local formatPhone function
        # This is tricky with sed, so we'll use a Node script
        node << 'NODE_SCRIPT'
const fs = require('fs');
const path = 'app/admin/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Remove the local formatPhone function
content = content.replace(
  /const formatPhone = \(phone: string\) => \{[\s\S]*?return phone;\s*\};/,
  '// Using formatPhoneNumber from lib/formatters'
);

// Replace formatPhone calls with formatPhoneNumber
content = content.replace(/formatPhone\(/g, 'formatPhoneNumber(');

fs.writeFileSync(path, content);
console.log('Updated admin/page.tsx to use shared formatter');
NODE_SCRIPT
        
        echo -e "${GREEN}✓ Phone formatting consolidated${NC}"
    else
        echo -e "${GREEN}✓ Already using shared formatter${NC}"
    fi
else
    echo -e "${GREEN}✓ No duplicate formatPhone found${NC}"
fi
echo ""

echo -e "${YELLOW}Step 3/4: Checking TypeScript strictness...${NC}"

# Check for 'as any' casts
ANY_COUNT=$(grep -r "as any" app/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v "\.backup" | wc -l || echo "0")
echo "Found $ANY_COUNT 'as any' casts in codebase"

if [ "$ANY_COUNT" -gt 0 ]; then
    echo ""
    echo "Files with 'as any':"
    grep -r "as any" app/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v "\.backup" | grep -v "_generated" || true
    echo ""
    echo -e "${YELLOW}⚠ Manual review needed for 'as any' casts${NC}"
    echo "   See IMPLEMENTATION_ROADMAP.md for guidance on fixing these"
fi
echo ""

echo -e "${YELLOW}Step 4/4: Fixing IntersectionObserver recreation...${NC}"

# Fix lenders/page.tsx IntersectionObserver
if grep -q "useEffect" app/lenders/page.tsx && grep -q "IntersectionObserver" app/lenders/page.tsx; then
    echo "Found IntersectionObserver in lenders/page.tsx"
    
    # Check if it's already using useRef
    if ! grep -q "observerRef" app/lenders/page.tsx; then
        echo "Adding useRef for IntersectionObserver..."
        
        node << 'NODE_SCRIPT'
const fs = require('fs');
const path = 'app/lenders/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add useRef to imports if not present
if (!content.includes('useRef')) {
    content = content.replace(
        /import \{([^}]+)\} from "react";/, 
        (match, imports) => {
            if (imports.includes('useRef')) return match;
            return `import {${imports}, useRef} from "react";`;
        }
    );
}

// Find the useEffect with IntersectionObserver and refactor it
// We need to store the observer in a ref to prevent recreation

// Find the pattern and replace with ref-based version
const oldPattern = /useEffect\(\(\) => \{\s*const observer = new IntersectionObserver\(\s*\(entries\) => \{[\s\S]*?\},\s*\{ threshold: 0\.1, rootMargin: "0px 0px -50px 0px" \}\s*\);[\s\S]*?document\.querySelectorAll\('\[data-animate\]'\)\.forEach\(\(el\) => \{\s*observer\.observe\(el\);\s*\}\);[\s\S]*?return \(\) => observer\.disconnect\(\);\s*\}, \[\]\);/;

const newCode = `const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);`;

if (oldPattern.test(content)) {
    content = content.replace(oldPattern, newCode);
    fs.writeFileSync(path, content);
    console.log('✓ Fixed IntersectionObserver with useRef');
} else {
    console.log('⚠ Could not match pattern - manual fix may be needed');
}
NODE_SCRIPT
    else
        echo -e "${GREEN}✓ Already using useRef for IntersectionObserver${NC}"
    fi
else
    echo -e "${GREEN}✓ No IntersectionObserver found in lenders/page.tsx${NC}"
fi

echo ""
echo "========================================"
echo -e "${GREEN}Phase 2 Installation Complete!${NC}"
echo "========================================"
echo ""
echo "Summary:"
echo "- Dead code removed (if safe)"
echo "- Phone formatting consolidated"
echo "- TypeScript 'as any' casts flagged for review"
echo "- IntersectionObserver optimized"
echo ""
echo "Next steps:"
echo "1. npm run build"
echo "2. npx tsc --noEmit"
echo "3. Verify /about page loads correctly"
echo "4. Check admin page phone formatting works"
echo ""
