#!/usr/bin/env node
/**
 * Theme Color Fixer Script
 * 
 * This script automates common theme-related color replacements in CSS files.
 * It identifies hardcoded colors and replaces them with theme-aware CSS variables.
 * 
 * Usage: node scripts/fix-theme-colors.js [options] [files...]
 *   --dry-run     Show what would be changed without making changes
 *   --verbose     Show detailed output
 *   --pattern     Specify a glob pattern (default: app all css files)
 *   --help        Show help
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// ============================================================================
// REPLACEMENT RULES
// ============================================================================

const REPLACEMENT_RULES = [
  // ===== BRAND COLOR (rgba(255, 107, 0, ...)) =====
  {
    name: 'brand-color-subtle',
    pattern: /rgba\(255,\s*107,\s*0,\s*0\.0[1-9]\)|rgba\(255,\s*107,\s*0,\s*0\.1[0-5]\)/g,
    replacement: 'var(--color-brand-subtle)',
    description: 'Brand color subtle (opacity 0.01-0.15)'
  },
  {
    name: 'brand-color-medium',
    pattern: /rgba\(255,\s*107,\s*0,\s*0\.(?:2[0-9]|3[0-9]|4[0-9])\)/g,
    replacement: 'var(--color-brand-border)',
    description: 'Brand color border (opacity 0.2-0.49)'
  },
  {
    name: 'brand-color-high',
    pattern: /rgba\(255,\s*107,\s*0,\s*0\.(?:5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\)/g,
    replacement: 'var(--color-brand)',
    description: 'Brand color high opacity (0.5+)'
  },
  {
    name: 'brand-color-solid',
    pattern: /rgba\(255,\s*107,\s*0,\s*1\)/g,
    replacement: 'var(--color-brand)',
    description: 'Brand color solid'
  },
  
  // ===== BRAND HOVER (#FF3D00 or rgba(255, 61, 0, ...)) =====
  {
    name: 'brand-hover-hex',
    pattern: /#FF3D00/gi,
    replacement: 'var(--color-brand-hover)',
    description: 'Brand hover hex color'
  },
  {
    name: 'brand-hover-rgba',
    pattern: /rgba\(255,\s*61,\s*0,\s*[\d.]+\)/g,
    replacement: 'var(--color-brand-hover)',
    description: 'Brand hover rgba color'
  },
  
  // ===== SUCCESS/ERROR COLORS =====
  {
    name: 'success-hex',
    pattern: /#10B981/g,
    replacement: 'var(--color-success)',
    description: 'Success green hex'
  },
  {
    name: 'success-rgba',
    pattern: /rgba\(16,\s*185,\s*129,\s*[\d.]+\)/g,
    replacement: 'var(--color-success)',
    description: 'Success green rgba'
  },
  {
    name: 'error-hex-ef4444',
    pattern: /#ef4444/g,
    replacement: 'var(--color-error)',
    description: 'Error red hex (ef4444)'
  },
  {
    name: 'error-hex-ff4444',
    pattern: /#ff4444/g,
    replacement: 'var(--color-error)',
    description: 'Error red hex (ff4444)'
  },
  {
    name: 'error-rgba',
    pattern: /rgba\(239,\s*68,\s*68,\s*[\d.]+\)/g,
    replacement: 'var(--color-error)',
    description: 'Error red rgba'
  },
  {
    name: 'error-rgba-255-68',
    pattern: /rgba\(255,\s*68,\s*68,\s*[\d.]+\)/g,
    replacement: 'var(--color-error)',
    description: 'Error red rgba (255,68,68)'
  },
  
  // ===== BLACK SHADOWS/OVERLAYS =====
  {
    name: 'shadow-soft',
    pattern: /rgba\(0,\s*0,\s*0,\s*0\.[0-6]\)/g,
    replacement: 'var(--shadow-color)',
    description: 'Black shadow (low opacity)'
  },
  {
    name: 'overlay-heavy',
    pattern: /rgba\(0,\s*0,\s*0,\s*0\.(?:[8-9][0-9]|95)\)/g,
    replacement: 'var(--overlay-heavy)',
    description: 'Heavy black overlay (0.8-0.95)'
  },
  {
    name: 'overlay-medium',
    pattern: /rgba\(0,\s*0,\s*0,\s*0\.[6-7][0-9]\)/g,
    replacement: 'var(--overlay-medium)',
    description: 'Medium black overlay (0.6-0.79)'
  },
  {
    name: 'overlay-solid',
    pattern: /rgba\(0,\s*0,\s*0,\s*1\)/g,
    replacement: 'var(--shadow-color)',
    description: 'Solid black'
  },
  
  // ===== DARK BACKGROUNDS (common page-specific dark colors) =====
  {
    name: 'dark-bg-14',
    pattern: /rgba\(14,\s*14,\s*12,\s*[\d.]+\)/g,
    replacement: 'var(--bg-primary)',
    description: 'Dark background (14,14,12)'
  },
  {
    name: 'dark-bg-20',
    pattern: /rgba\(20,\s*20,\s*16,\s*[\d.]+\)/g,
    replacement: 'var(--bg-secondary)',
    description: 'Dark background (20,20,16)'
  },
  {
    name: 'dark-bg-26',
    pattern: /rgba\(26,\s*24,\s*21,\s*[\d.]+\)/g,
    replacement: 'var(--bg-tertiary)',
    description: 'Dark background (26,24,21)'
  },
  {
    name: 'dark-bg-10',
    pattern: /rgba\(10,\s*10,\s*10,\s*[\d.]+\)/g,
    replacement: 'var(--bg-primary)',
    description: 'Dark background (10,10,10)'
  },
  
  // ===== GRADIENT FIXES =====
  // Note: These are more complex and may need manual review
  {
    name: 'gradient-brand-fade',
    pattern: /rgba\(255,\s*107,\s*0,\s*0\)/g,
    replacement: 'transparent',
    description: 'Brand color to transparent in gradients'
  }
];

// ===== GRADIENT PATTERN FIXES =====
// These require special handling for linear-gradient contexts
const GRADIENT_FIXES = [
  {
    name: 'brand-gradient-pairs',
    pattern: /linear-gradient\(([^)]*?)rgba\(255,\s*107,\s*0,\s*0\.1\)([^)]*?)rgba\(20,\s*20,\s*16,\s*0\.8\)/g,
    replacement: 'linear-gradient($1var(--color-brand-subtle)$2var(--overlay-medium))',
    description: 'Brand to dark gradient'
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function findFiles(pattern) {
  try {
    return globSync(pattern, { 
      cwd: process.cwd(),
      absolute: true 
    }).filter(file => file.endsWith('.css'));
  } catch (error) {
    console.error('Error finding files:', error.message);
    process.exit(1);
  }
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const matches = [];
  
  lines.forEach((line, index) => {
    REPLACEMENT_RULES.forEach(rule => {
      const lineMatches = line.match(rule.pattern);
      if (lineMatches) {
        matches.push({
          line: index + 1,
          rule: rule.name,
          description: rule.description,
          matches: lineMatches,
          original: line.trim()
        });
      }
    });
  });
  
  return { content, lines, matches };
}

function fixFile(filePath, options = {}) {
  const { dryRun = false, verbose = false } = options;
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  const changes = [];
  
  // Apply simple replacements
  REPLACEMENT_RULES.forEach(rule => {
    const matches = content.match(rule.pattern);
    if (matches) {
      const before = content;
      content = content.replace(rule.pattern, rule.replacement);
      
      if (content !== before) {
        changes.push({
          rule: rule.name,
          description: rule.description,
          count: matches.length,
          replacement: rule.replacement
        });
      }
    }
  });
  
  // Apply gradient fixes
  GRADIENT_FIXES.forEach(rule => {
    const matches = content.match(rule.pattern);
    if (matches) {
      const before = content;
      content = content.replace(rule.pattern, rule.replacement);
      
      if (content !== before) {
        changes.push({
          rule: rule.name,
          description: rule.description,
          count: matches.length,
          replacement: 'gradient pattern'
        });
      }
    }
  });
  
  // Write changes if not dry run
  if (!dryRun && content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  
  return {
    changed: content !== originalContent,
    changes,
    originalLength: originalContent.length,
    newLength: content.length
  };
}

function printHelp() {
  console.log(`
Theme Color Fixer Script
========================

Automates theme-related color replacements in CSS files.

Usage:
  node scripts/fix-theme-colors.js [options] [files...]

Options:
  --dry-run          Show what would be changed without making changes
  --verbose          Show detailed output for each file
  --pattern <glob>   Specify a glob pattern (default: "app/**/*.css")
  --analyze          Only analyze files, don't fix
  --help             Show this help message

Examples:
  # Dry run on all CSS files
  node scripts/fix-theme-colors.js --dry-run

  # Fix specific files
  node scripts/fix-theme-colors.js app/brokers/brokers.css

  # Analyze with verbose output
  node scripts/fix-theme-colors.js --analyze --verbose

  # Fix files matching a pattern
  node scripts/fix-theme-colors.js --pattern "app/brokers/*.css"
`);
}

function printSummary(stats) {
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files scanned:      ${stats.totalFiles}`);
  console.log(`Files with issues:  ${stats.filesWithIssues}`);
  console.log(`Files changed:      ${stats.filesChanged}`);
  console.log(`Total replacements: ${stats.totalReplacements}`);
  
  if (stats.ruleCounts && Object.keys(stats.ruleCounts).length > 0) {
    console.log('\nReplacements by rule:');
    Object.entries(stats.ruleCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([rule, count]) => {
        console.log(`  ${rule.padEnd(25)} ${count.toString().padStart(4)}`);
      });
  }
  
  console.log('='.repeat(60));
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  const options = {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose'),
    analyze: args.includes('--analyze'),
    help: args.includes('--help'),
    pattern: 'app/**/*.css'
  };
  
  // Check for pattern option
  const patternIndex = args.indexOf('--pattern');
  if (patternIndex !== -1 && args[patternIndex + 1]) {
    options.pattern = args[patternIndex + 1];
  }
  
  // Show help
  if (options.help || args.length === 0) {
    printHelp();
    process.exit(0);
  }
  
  // Get file list
  let files;
  const fileArgs = args.filter(arg => !arg.startsWith('--') && !arg.includes('*'));
  
  if (fileArgs.length > 0) {
    files = fileArgs.map(f => path.resolve(f));
  } else {
    files = findFiles(options.pattern);
  }
  
  if (files.length === 0) {
    console.log('No CSS files found.');
    process.exit(0);
  }
  
  console.log(`Found ${files.length} CSS file(s)`);
  if (options.dryRun) {
    console.log('(DRY RUN - no changes will be made)');
  }
  console.log('');
  
  // Process files
  const stats = {
    totalFiles: files.length,
    filesWithIssues: 0,
    filesChanged: 0,
    totalReplacements: 0,
    ruleCounts: {}
  };
  
  files.forEach(filePath => {
    const relativePath = path.relative(process.cwd(), filePath);
    
    try {
      if (options.analyze || options.verbose) {
        const analysis = analyzeFile(filePath);
        
        if (analysis.matches.length > 0) {
          stats.filesWithIssues++;
          
          if (options.verbose) {
            console.log(`\n📄 ${relativePath}`);
            console.log('-'.repeat(60));
            
            analysis.matches.forEach(match => {
              console.log(`  Line ${match.line}: ${match.description}`);
              console.log(`    Found: ${match.matches.join(', ')}`);
              if (match.original.length < 100) {
                console.log(`    Context: ${match.original}`);
              }
            });
          } else {
            console.log(`${relativePath}: ${analysis.matches.length} issue(s)`);
          }
        }
      }
      
      if (!options.analyze) {
        const result = fixFile(filePath, options);
        
        if (result.changed) {
          stats.filesChanged++;
          
          result.changes.forEach(change => {
            stats.totalReplacements += change.count;
            stats.ruleCounts[change.rule] = (stats.ruleCounts[change.rule] || 0) + change.count;
          });
          
          if (!options.verbose) {
            console.log(`${options.dryRun ? '[DRY] ' : ''}${relativePath}: ${result.changes.length} type(s) of changes`);
          }
        } else if (options.verbose) {
          console.log(`${relativePath}: No changes needed`);
        }
      }
    } catch (error) {
      console.error(`Error processing ${relativePath}:`, error.message);
    }
  });
  
  printSummary(stats);
  
  if (options.dryRun && stats.totalReplacements > 0) {
    console.log('\nRun without --dry-run to apply changes.');
  }
}

main();
