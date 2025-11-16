# 🛡️ Error Prevention Guide for Cycle Paradise

This document outlines the preventive measures implemented to avoid common development errors.

## 🚫 Prevented Error Types

### 1. Reserved Word Usage (`package`)
**Problem**: JavaScript/TypeScript reserved word `package` used as variable name
**Prevention**:
- ESLint rule: `no-restricted-syntax` catches `package` usage
- Custom validation script checks for patterns like `.map((package))`
- Pre-commit hook validates before commits

**✅ Correct Usage**:
```javascript
// ❌ Wrong - 'package' is reserved
packages.map((package) => <PackageCard package={package} />)

// ✅ Correct - use descriptive alternatives
packages.map((tourPackage) => <PackageCard package={tourPackage} />)
packages.map((pkg) => <PackageCard package={pkg} />)
```

### 2. TypeScript Type Errors
**Problem**: Prisma transaction type mismatches
**Prevention**:
- Strict TypeScript configuration
- Pre-commit type checking with `tsc --noEmit`
- ESLint TypeScript rules for type safety

**✅ Correct Usage**:
```typescript
// ✅ Correct transaction type
async transaction<T>(
  fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
): Promise<T>
```

### 3. Syntax Errors (Extra Brackets)
**Problem**: Extra `]);` causing compilation failures
**Prevention**:
- Custom validation script checks for suspicious bracket patterns
- ESLint syntax error detection
- Build validation in pre-commit hooks

### 4. Missing `getStaticPaths` in Dynamic Routes
**Problem**: Astro dynamic routes require `getStaticPaths` for static builds
**Prevention**:
- Custom validation checks dynamic route files for `getStaticPaths`
- Template snippets for quick implementation
- Documentation reminders

**✅ Required Pattern**:
```typescript
// ✅ Required for [slug].astro files
export async function getStaticPaths() {
  const items = await repository.findMany({ limit: 100 });
  return items.map((item) => ({
    params: { slug: item.slug },
  }));
}
```

## 🔧 Validation Tools

### 1. ESLint Configuration (`.eslintrc.json`)
- **Reserved word detection**: Prevents `package` variable usage
- **TypeScript rules**: Type safety enforcement
- **Astro-specific rules**: Framework best practices
- **Syntax validation**: Catches common mistakes

### 2. Custom Validation Script (`scripts/validate.mjs`)
- **Pattern detection**: Finds problematic code patterns
- **Type consistency**: Checks TypeScript usage
- **Dynamic route validation**: Ensures `getStaticPaths` presence
- **Comprehensive reporting**: Detailed error and warning output

### 3. Pre-commit Hooks (`.githooks/`)
- **Bash version** (`pre-commit`): For Unix/Linux/Mac
- **PowerShell version** (`pre-commit.ps1`): For Windows
- **Multi-step validation**: TypeScript → ESLint → Custom → Build
- **Automatic failure**: Prevents bad commits

## 🚀 Usage Commands

### Development Validation
```bash
# Run all validation checks
npm run check-all

# Individual checks
npm run type-check     # TypeScript validation
npm run lint           # ESLint validation  
npm run validate       # Custom validation script
npm run build          # Astro build test

# Fix issues automatically
npm run lint:fix       # Auto-fix ESLint issues
npm run format         # Format with Prettier
```

### Git Integration
```bash
# Setup git hooks (one-time setup)
npm run setup-hooks

# Manual pre-commit check
npm run pre-commit
```

## 🎯 VS Code Integration

### Automatic Error Detection
The `.vscode/settings.json` configuration provides:
- **Real-time ESLint validation**
- **TypeScript strict mode**
- **Format on save**
- **Auto-fix on save**
- **Problem highlighting**

### Recommended Extensions
- ESLint (automatic error detection)
- Astro (framework support)
- Error Lens (inline error display)
- TypeScript Importer (proper imports)

## 📋 Error Prevention Checklist

Before committing code, ensure:

- [ ] **No reserved words used as variables**
  - Check for `package`, `interface`, `class`, etc.
  - Use descriptive alternatives: `tourPackage`, `pkg`, `item`

- [ ] **TypeScript types are correct**
  - Run `npm run type-check`
  - Fix any type mismatches
  - Add proper return type annotations

- [ ] **Dynamic routes have `getStaticPaths`**
  - Any `[slug].astro` file needs the export
  - Return proper parameter objects
  - Handle repository errors gracefully

- [ ] **Build completes successfully**
  - Run `npm run build`
  - Fix any compilation errors
  - Test with empty database (fallback data)

- [ ] **ESLint passes without warnings**
  - Run `npm run lint`
  - Fix or suppress legitimate warnings
  - Use `npm run lint:fix` for auto-fixes

## 🔄 Continuous Integration

For CI/CD pipelines, add this validation step:

```yaml
# .github/workflows/validate.yml
- name: Validate Code Quality
  run: |
    npm ci
    npm run check-all
```

This ensures all validation passes before deployment.

## 🆘 Common Error Solutions

### "package is a reserved word"
```bash
# Find all instances
grep -r "\.map((package)" src/
# Replace with:
sed -i 's/\.map((package)/\.map((tourPackage)/g' src/**/*.astro
```

### "getStaticPaths required"
Add to dynamic route files:
```typescript
export async function getStaticPaths() {
  try {
    const result = await repository.findMany({ limit: 100 });
    return result.items.map((item) => ({
      params: { slug: item.slug },
    }));
  } catch (error) {
    console.error('Error generating static paths:', error);
    return [];
  }
}
```

### TypeScript transaction errors
Use the correct type signature:
```typescript
async transaction<T>(
  fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
): Promise<T>
```

## 📚 Additional Resources

- [ESLint Rules Documentation](https://eslint.org/docs/rules/)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [Astro Dynamic Routing](https://docs.astro.build/en/guides/routing/#dynamic-routes)
- [Prisma Client Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

**Remember**: These tools catch errors early, but careful coding practices are still the best prevention! 🎯