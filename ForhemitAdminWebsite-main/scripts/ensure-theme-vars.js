#!/usr/bin/env node
/**
 * Ensure Theme Variables Script
 * 
 * Checks that theme.css contains all necessary CSS variables for light/dark mode.
 * Adds any missing variables with sensible defaults.
 * 
 * Usage: node scripts/ensure-theme-vars.js
 */

const fs = require('fs');
const path = require('path');

const THEME_FILE = path.join(process.cwd(), 'app', 'styles', 'theme.css');

// Required theme variables with their dark/light values
const REQUIRED_VARIABLES = {
  // Status colors
  '--color-success': { dark: '#10B981', light: '#059669' },
  '--color-success-bg': { dark: 'rgba(16, 185, 129, 0.15)', light: 'rgba(5, 150, 105, 0.15)' },
  '--color-success-border': { dark: 'rgba(16, 185, 129, 0.2)', light: 'rgba(5, 150, 105, 0.25)' },
  '--color-success-subtle': { dark: 'rgba(16, 185, 129, 0.08)', light: 'rgba(5, 150, 105, 0.08)' },
  '--color-error': { dark: '#ef4444', light: '#dc2626' },
  '--color-error-bg': { dark: 'rgba(239, 68, 68, 0.1)', light: 'rgba(220, 38, 38, 0.1)' },
  '--color-error-border': { dark: 'rgba(239, 68, 68, 0.3)', light: 'rgba(220, 38, 38, 0.25)' },
  
  // Overlays
  '--overlay-heavy': { dark: 'rgba(0, 0, 0, 0.9)', light: 'rgba(255, 255, 255, 0.95)' },
  '--overlay-medium': { dark: 'rgba(0, 0, 0, 0.8)', light: 'rgba(255, 255, 255, 0.8)' },
  '--overlay-light': { dark: 'rgba(0, 0, 0, 0.5)', light: 'rgba(0, 0, 0, 0.3)' },
  
  // Component-specific
  '--toggle-shadow': { dark: '0 2px 4px rgba(0, 0, 0, 0.2)', light: '0 2px 4px rgba(0, 0, 0, 0.15)' },
  '--progress-bar-bg': { dark: 'rgba(255, 255, 255, 0.1)', light: 'rgba(0, 0, 0, 0.08)' },
  '--dropzone-border': { dark: 'rgba(255, 255, 255, 0.2)', light: 'rgba(0, 0, 0, 0.15)' },
  '--badge-bg': { dark: 'rgba(255, 255, 255, 0.08)', light: 'rgba(0, 0, 0, 0.05)' },
  '--badge-border': { dark: 'rgba(255, 255, 255, 0.15)', light: 'rgba(0, 0, 0, 0.1)' }
};

function parseThemeFile(content) {
  const darkVars = new Set();
  const lightVars = new Set();
  
  let inDark = false;
  let inLight = false;
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed === ':root {') {
      inDark = true;
      inLight = false;
      continue;
    }
    
    if (trimmed === '[data-theme="light"] {') {
      inDark = false;
      inLight = true;
      continue;
    }
    
    if (trimmed === '}') {
      inDark = false;
      inLight = false;
      continue;
    }
    
    const match = trimmed.match(/^(--[\w-]+):/);
    if (match) {
      if (inDark) darkVars.add(match[1]);
      if (inLight) lightVars.add(match[1]);
    }
  }
  
  return { darkVars, lightVars };
}

function addMissingVariables(content) {
  const { darkVars, lightVars } = parseThemeFile(content);
  const missing = [];
  
  for (const [varName, values] of Object.entries(REQUIRED_VARIABLES)) {
    if (!darkVars.has(varName)) {
      missing.push({ var: varName, section: 'dark', value: values.dark });
    }
    if (!lightVars.has(varName)) {
      missing.push({ var: varName, section: 'light', value: values.light });
    }
  }
  
  if (missing.length === 0) {
    return { content, added: 0 };
  }
  
  let newContent = content;
  
  // Group by section
  const darkMissing = missing.filter(m => m.section === 'dark');
  const lightMissing = missing.filter(m => m.section === 'light');
  
  // Add dark variables before closing of :root
  if (darkMissing.length > 0) {
    const darkVarsBlock = '\n  /* Status & Component Colors */\n' + 
      darkMissing.map(m => `  ${m.var}: ${m.value};`).join('\n');
    
    // Find the closing of :root (before [data-theme="light"])
    const rootEndMatch = newContent.match(/(\s+\/\* ========== SMOOTH THEME TRANSITIONS ========== \*\/)/);
    if (rootEndMatch) {
      newContent = newContent.slice(0, rootEndMatch.index) + 
        darkVarsBlock + '\n' + 
        newContent.slice(rootEndMatch.index);
    }
  }
  
  // Add light variables before closing of [data-theme="light"]
  if (lightMissing.length > 0) {
    const lightVarsBlock = '\n  /* Status & Component Colors */\n' + 
      lightMissing.map(m => `  ${m.var}: ${m.value};`).join('\n');
    
    // Find the last closing brace before the end
    const lightEndMatch = newContent.match(/(\[data-theme="light"\] \{[\s\S]*?)(\n\})/);
    if (lightEndMatch) {
      const insertPos = lightEndMatch.index + lightEndMatch[1].length;
      newContent = newContent.slice(0, insertPos) + 
        lightVarsBlock + 
        newContent.slice(insertPos);
    }
  }
  
  return { content: newContent, added: missing.length };
}

function main() {
  console.log('Ensuring theme variables...\n');
  
  if (!fs.existsSync(THEME_FILE)) {
    console.error(`Theme file not found: ${THEME_FILE}`);
    process.exit(1);
  }
  
  const content = fs.readFileSync(THEME_FILE, 'utf-8');
  const { darkVars, lightVars } = parseThemeFile(content);
  
  console.log('Current variables:');
  console.log(`  Dark theme:  ${darkVars.size} variables`);
  console.log(`  Light theme: ${lightVars.size} variables`);
  console.log('');
  
  const { content: newContent, added } = addMissingVariables(content);
  
  if (added === 0) {
    console.log('✅ All required variables are present.');
  } else {
    console.log(`Adding ${added} missing variable(s)...`);
    fs.writeFileSync(THEME_FILE, newContent, 'utf-8');
    console.log(`✅ Updated ${THEME_FILE}`);
    
    // Show what was added
    const { darkVars: newDark, lightVars: newLight } = parseThemeFile(newContent);
    const addedDark = [...newDark].filter(v => !darkVars.has(v));
    const addedLight = [...newLight].filter(v => !lightVars.has(v));
    
    if (addedDark.length > 0) {
      console.log('\nAdded to :root:');
      addedDark.forEach(v => console.log(`  ${v}`));
    }
    
    if (addedLight.length > 0) {
      console.log('\nAdded to [data-theme="light"]:');
      addedLight.forEach(v => console.log(`  ${v}`));
    }
  }
}

main();
