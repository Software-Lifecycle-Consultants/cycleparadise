# Pre-commit hook to prevent common errors (Windows PowerShell version)

Write-Host "[PRECOMMIT] Running pre-commit checks..." -ForegroundColor Blue

# 1. TypeScript type checking
Write-Host "[TS] Checking TypeScript..." -ForegroundColor Yellow
try {
    npm run type-check
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] TypeScript errors found. Please fix before committing." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[ERROR] TypeScript check failed." -ForegroundColor Red
    exit 1
}

# 2. Custom validation checks
Write-Host "[VALIDATION] Running custom validation..." -ForegroundColor Yellow
try {
    npm run validate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Validation errors found. Please fix before committing." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[ERROR] Custom validation failed." -ForegroundColor Red
    exit 1
}

# 3. Check for reserved word usage
Write-Host "[RESERVED] Checking for reserved word usage..." -ForegroundColor Yellow
$packageUsage = Get-ChildItem -Path "src" -Recurse -Include "*.astro","*.ts","*.js" | Select-String "\.map\(\(package\)"
if ($packageUsage) {
    Write-Host "[ERROR] Found usage of 'package' as variable name (reserved word). Use 'tourPackage', 'pkg', or similar instead." -ForegroundColor Red
    Write-Host $packageUsage -ForegroundColor Red
    exit 1
}

# 4. Check for common syntax errors
Write-Host "[CHECK] Checking for common syntax errors..." -ForegroundColor Yellow
$syntaxErrors = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.js" | Select-String "\]\);" | Where-Object { $_.Line -notmatch "async" -and $_.Line -notmatch "Promise.all" }
if ($syntaxErrors) {
    Write-Host "[WARNING] Found potential extra ']); patterns. Please review:" -ForegroundColor Yellow
    Write-Host $syntaxErrors -ForegroundColor Yellow
}

Write-Host "[SUCCESS] All pre-commit checks passed!" -ForegroundColor Green
exit 0