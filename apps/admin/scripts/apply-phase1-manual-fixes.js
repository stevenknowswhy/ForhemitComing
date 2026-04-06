#!/usr/bin/env node
/**
 * Phase 1 Manual Fixes Helper
 * Applies complex modifications that are hard to do with sed
 */

const fs = require('fs');
const path = require('path');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Fix 1: XSS in InfrastructureAuditModal
function fixXSS() {
  const filePath = 'app/components/modals/InfrastructureAuditModal.tsx';
  log('\n📋 Fix 1: XSS in InfrastructureAuditModal', 'yellow');
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already fixed
  if (content.includes('sanitizedDiagnostic')) {
    log('  ✓ Already fixed', 'green');
    return;
  }
  
  // Add DOMPurify import
  if (!content.includes('isomorphic-dompurify')) {
    content = content.replace(
      '"use client";',
      '"use client";\n\nimport DOMPurify from "isomorphic-dompurify";'
    );
    log('  ✓ Added DOMPurify import', 'green');
  }
  
  // Add sanitization - we need to find where diagnostic is used with dangerouslySetInnerHTML
  // Look for the pattern where diagnostic HTML is rendered
  
  // Find the component that renders diagnostic and add sanitization
  // The diagnostic comes from getDiagnosticText and is used in the render
  
  // We need to add useMemo import if not present and sanitize the diagnostic
  if (!content.includes('useMemo')) {
    content = content.replace(
      'import { useState } from "react";',
      'import { useState, useMemo } from "react";'
    );
    log('  ✓ Added useMemo import', 'green');
  }
  
  // Find the results calculation and add sanitization
  // Look for where calculateResults is called and diagnostic is generated
  
  // Find the render section where dangerouslySetInnerHTML is used
  const lines = content.split('\n');
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    // Look for dangerouslySetInnerHTML usage
    if (lines[i].includes('dangerouslySetInnerHTML') && lines[i].includes('__html')) {
      // This is where we need to sanitize
      // The content is likely in a variable like diagnostic or similar
      
      // For now, let's add a comment and the sanitization pattern
      // The actual implementation depends on how the HTML is constructed
      
      // Check if it's the diagnostic content
      if (lines[i].includes('diagnostic') || lines[i-5].includes('diagnostic')) {
        lines[i-1] = lines[i-1].replace(
          /^(\s*)(.*)/,
          `$1const sanitizedDiagnostic = useMemo(() => DOMPurify.sanitize(diagnostic), [diagnostic]);\n$1$2`
        );
        
        // Replace the __html value
        lines[i] = lines[i].replace(
          /__html:\s*\w+/,
          '__html: sanitizedDiagnostic'
        );
        modified = true;
        log('  ✓ Added sanitization for diagnostic HTML', 'green');
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'));
    log('  ✓ File updated', 'green');
  } else {
    log('  ⚠ Could not auto-fix - please apply manually', 'yellow');
    log('    See PHASE1_QUICKSTART.md for manual instructions', 'yellow');
  }
}

// Fix 2: Memory leak in EarlyAccessForm
function fixEarlyAccessForm() {
  const filePath = 'app/components/forms/EarlyAccessForm.tsx';
  log('\n📋 Fix 2: Memory leak in EarlyAccessForm', 'yellow');
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already fixed
  if (content.includes('useEffect') && content.includes('clearTimeout') && content.includes('handleClose')) {
    log('  ✓ Already fixed', 'green');
    return;
  }
  
  // We need to wrap the setTimeout in a useEffect
  // Current code: setTimeout(() => { handleClose(); }, 2000);
  // Should be wrapped in useEffect with cleanup
  
  // First, add useEffect to imports if not present
  if (!content.includes('useEffect')) {
    content = content.replace(
      'import { useState } from "react";',
      'import { useState, useEffect } from "react";'
    );
    log('  ✓ Added useEffect import', 'green');
  }
  
  // Now we need to replace the setTimeout with a useEffect
  // This is tricky because we need to trigger it on status change
  
  // Find the setTimeout and replace with useEffect pattern
  const oldPattern = /setTimeout\(\(\) => \{\s*handleClose\(\);\s*\}, 2000\);/;
  
  if (oldPattern.test(content)) {
    // Replace the setTimeout call with nothing (we'll add useEffect elsewhere)
    content = content.replace(oldPattern, '// Auto-close timer moved to useEffect');
    
    // Add useEffect after the state declarations
    const useEffectCode = `
  // Auto-close modal after successful submission
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, handleClose]);
`;
    
    // Find a good place to insert - after the state declarations, before handleClose function
    const insertPoint = content.indexOf('const handleClose =');
    if (insertPoint !== -1) {
      content = content.slice(0, insertPoint) + useEffectCode + '\n' + content.slice(insertPoint);
      fs.writeFileSync(filePath, content);
      log('  ✓ Fixed memory leak with useEffect cleanup', 'green');
    } else {
      log('  ⚠ Could not find insertion point - please apply manually', 'yellow');
    }
  } else {
    log('  ⚠ Pattern not found - may already be fixed or need manual fix', 'yellow');
  }
}

// Fix 3: Memory leak in GalleryContainer
function fixGalleryContainer() {
  const filePath = 'app/about/_archive/components/GalleryContainer.tsx';
  
  // Check if file exists (might have been deleted)
  if (!fs.existsSync(filePath)) {
    log('\n📋 Fix 3: GalleryContainer (skipped - file not found, may be archived)', 'yellow');
    return;
  }
  
  log('\n📋 Fix 3: Memory leak in GalleryContainer', 'yellow');
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already fixed
  if (content.includes('timeoutRef') || content.includes('useRef')) {
    log('  ✓ Already fixed', 'green');
    return;
  }
  
  // Add useRef to imports
  if (!content.includes('useRef')) {
    content = content.replace(
      /import \{([^}]+)\} from "react";/,
      (match, imports) => {
        if (imports.includes('useRef')) return match;
        return `import {${imports}, useRef} from "react";`;
      }
    );
    log('  ✓ Added useRef import', 'green');
  }
  
  // Add timeoutRef at component level
  const componentStart = content.indexOf('export function GalleryContainer');
  const stateStart = content.indexOf('const [direction', componentStart);
  
  if (stateStart !== -1) {
    const refCode = '  const timeoutRef = useRef<NodeJS.Timeout | null>(null);\n';
    content = content.slice(0, stateStart) + refCode + content.slice(stateStart);
    log('  ✓ Added timeoutRef', 'green');
  }
  
  // Replace setTimeout with ref assignment
  content = content.replace(
    /setTimeout\(\(\) => \{\s*setIsTransitioning\(false\);\s*\}, prefersReducedMotion \? 0 : 500\);/,
    'timeoutRef.current = setTimeout(() => { setIsTransitioning(false); }, prefersReducedMotion ? 0 : 500);'
  );
  
  // Add cleanup useEffect
  const cleanupCode = `
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
`;
  
  // Find insertion point after other useEffects or before the goToSlide function
  const insertPoint = content.indexOf('const goToSlide');
  if (insertPoint !== -1) {
    content = content.slice(0, insertPoint) + cleanupCode + '\n' + content.slice(insertPoint);
  }
  
  fs.writeFileSync(filePath, content);
  log('  ✓ Fixed memory leak with ref and cleanup', 'green');
}

// Main execution
log('========================================', 'green');
log('Phase 1 Manual Fixes Helper', 'green');
log('========================================', 'green');

try {
  fixXSS();
  fixEarlyAccessForm();
  fixGalleryContainer();
  
  log('\n========================================', 'green');
  log('Manual fixes complete!', 'green');
  log('========================================', 'green');
  log('\nNext steps:', 'yellow');
  log('1. Run: npm run build');
  log('2. Run: npx tsc --noEmit');
  log('3. Test error boundary (temporarily add throw new Error("test") to a page)');
  log('4. Test all forms still work');
  log('\nIf any fixes failed, see PHASE1_QUICKSTART.md for manual instructions.', 'yellow');
  
} catch (error) {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
}
