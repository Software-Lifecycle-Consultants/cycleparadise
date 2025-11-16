#!/usr/bin/env node

/**
 * Custom validation script to check for common errors
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const errors = [];
const warnings = [];

// Recursively get all files
function getAllFiles(dir, extensions = ['.ts', '.js', '.astro']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && extensions.includes(extname(item))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Check for reserved word usage
function checkReservedWords(files) {
  console.log('🚫 Checking for reserved word usage...');
  
  const reservedPatterns = [
    /\.map\(\(package\)/g,
    /const\s+package\s*=/g,
    /let\s+package\s*=/g,
    /var\s+package\s*=/g,
    /function\s*\(\s*package\s*\)/g,
    /\(\s*package\s*\)\s*=>/g
  ];
  
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8');
      
      for (const pattern of reservedPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          errors.push({
            file,
            error: `Reserved word 'package' used as variable name`,
            matches: matches,
            suggestion: `Use 'tourPackage', 'pkg', or similar instead`
          });
        }
      }
    } catch (err) {
      warnings.push(`Could not read file: ${file}`);
    }
  }
}

// Check for common syntax errors
function checkSyntaxErrors(files) {
  console.log('🔍 Checking for syntax errors...');
  
  const problematicPatterns = [
    // Extra closing brackets in non-array contexts
    { pattern: /\s+\]\);\s*$/, message: 'Potential extra "]); - check for array closing bracket errors' },
    // Missing getStaticPaths in dynamic routes
    { pattern: /\[.*\]\.astro/, message: 'Dynamic route detected - ensure getStaticPaths is exported', filePattern: true },
    // Missing return types in critical functions
    { pattern: /async function [^(]*\([^)]*\)\s*{/, message: 'Consider adding return type annotation' },
    // Inconsistent quote usage
    { pattern: /(['"]).*\1.*(['"]).*\2/, message: 'Mixed quote usage - consider consistent quote style' }
  ];
  
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      // Check for dynamic routes without getStaticPaths
      if (file.includes('[') && file.includes(']') && file.endsWith('.astro')) {
        if (!content.includes('getStaticPaths')) {
          errors.push({
            file,
            error: 'Dynamic route missing getStaticPaths function',
            suggestion: 'Add: export async function getStaticPaths() { ... }'
          });
        }
      }
      
      // Check line by line for patterns
      lines.forEach((line, index) => {
        for (const { pattern, message } of problematicPatterns) {
          if (!pattern.filePattern && pattern.test(line)) {
            warnings.push({
              file,
              line: index + 1,
              warning: message,
              content: line.trim()
            });
          }
        }
      });
      
    } catch (err) {
      warnings.push(`Could not analyze file: ${file}`);
    }
  }
}

// Check TypeScript type consistency
function checkTypeConsistency(files) {
  console.log('📝 Checking TypeScript consistency...');
  
  const typeFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  
  for (const file of typeFiles) {
    try {
      const content = readFileSync(file, 'utf8');
      
      // Check for missing return types on exported functions
      const exportedFunctionPattern = /export\s+(async\s+)?function\s+[^(]*\([^)]*\)\s*{/g;
      const matches = content.match(exportedFunctionPattern);
      
      if (matches) {
        for (const match of matches) {
          if (!match.includes(':')) {
            warnings.push({
              file,
              warning: 'Exported function missing return type',
              content: match.trim(),
              suggestion: 'Add return type annotation for better type safety'
            });
          }
        }
      }
      
    } catch (err) {
      warnings.push(`Could not check types in file: ${file}`);
    }
  }
}

// Main validation
function runValidation() {
  console.log('🔍 Running custom validation checks...\n');
  
  const srcFiles = getAllFiles('./src');
  
  checkReservedWords(srcFiles);
  checkSyntaxErrors(srcFiles);
  checkTypeConsistency(srcFiles);
  
  // Report results
  console.log('\n📊 Validation Results:');
  
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} Error(s) found:`);
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.file}`);
      console.log(`   Error: ${error.error}`);
      if (error.suggestion) {
        console.log(`   Suggestion: ${error.suggestion}`);
      }
      if (error.matches) {
        console.log(`   Matches: ${error.matches.join(', ')}`);
      }
      console.log('');
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} Warning(s):`);
    warnings.forEach((warning, index) => {
      if (typeof warning === 'string') {
        console.log(`${index + 1}. ${warning}`);
      } else {
        console.log(`${index + 1}. ${warning.file}${warning.line ? `:${warning.line}` : ''}`);
        console.log(`   Warning: ${warning.warning}`);
        if (warning.content) {
          console.log(`   Code: ${warning.content}`);
        }
        if (warning.suggestion) {
          console.log(`   Suggestion: ${warning.suggestion}`);
        }
      }
      console.log('');
    });
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ No issues found!');
  }
  
  // Exit with error code if there are errors
  process.exit(errors.length > 0 ? 1 : 0);
}

// Run the validation
runValidation();