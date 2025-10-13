#!/usr/bin/env node

/**
 * Security Scanner for HeliosHash DAO
 * Performs comprehensive security checks on the codebase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 HeliosHash DAO Security Scanner');
console.log('='.repeat(50));

let issues = [];
let warnings = [];

function addIssue(severity, category, message, file = null) {
  const issue = { severity, category, message, file, timestamp: new Date().toISOString() };
  if (severity === 'HIGH' || severity === 'CRITICAL') {
    issues.push(issue);
  } else {
    warnings.push(issue);
  }
}

function scanFiles() {
  console.log('\n📁 Scanning files for security issues...');
  
  const sensitivePatterns = [
    { pattern: /password\s*[:=]\s*['"][^'"]+['"]/gi, desc: 'Potential password in code' },
    { pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi, desc: 'Potential API key in code' },
    { pattern: /secret\s*[:=]\s*['"][^'"]+['"]/gi, desc: 'Potential secret in code' },
    { pattern: /token\s*[:=]\s*['"][^'"]+['"]/gi, desc: 'Potential token in code' },
    { pattern: /private[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi, desc: 'Potential private key in code' },
  ];

  function scanDirectory(dir, extensions = ['.ts', '.tsx', '.js', '.jsx', '.mo']) {
    if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('.next')) return;
    
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        scanDirectory(filePath, extensions);
      } else if (extensions.some(ext => file.name.endsWith(ext))) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          for (const { pattern, desc } of sensitivePatterns) {
            const matches = content.match(pattern);
            if (matches && !content.includes('// SAFE:') && !content.includes('// EXAMPLE:')) {
              addIssue('HIGH', 'SECRETS', `${desc}: ${matches[0]}`, filePath);
            }
          }
          
          // Check for eval usage
          if (content.includes('eval(') && !content.includes('// SAFE:')) {
            addIssue('HIGH', 'CODE_INJECTION', 'Potential code injection via eval()', filePath);
          }
          
          // Check for innerHTML usage
          if (content.includes('innerHTML') && !content.includes('// SAFE:')) {
            addIssue('MEDIUM', 'XSS', 'Potential XSS via innerHTML', filePath);
          }
          
        } catch (error) {
          addIssue('LOW', 'FILE_ACCESS', `Cannot read file: ${error.message}`, filePath);
        }
      }
    }
  }
  
  scanDirectory('./src');
  scanDirectory('./canisters');
}

function checkFilePermissions() {
  console.log('\n🔒 Checking file permissions...');
  
  try {
    const worldWritableFiles = execSync('find . -type f -perm /o+w -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.next/*" -not -path "./playwright-report/*" -not -path "./coverage/*" 2>/dev/null || true', { encoding: 'utf8' });
    
    if (worldWritableFiles.trim()) {
      const suspiciousFiles = worldWritableFiles.trim().split('\n').filter(file => 
        !file.includes('/.next/') && 
        !file.includes('/node_modules/') && 
        !file.includes('playwright-report/') &&
        !file.includes('/coverage/') &&
        !file.endsWith('.log') &&
        !file.endsWith('.tmp')
      );
      
      if (suspiciousFiles.length > 0 && suspiciousFiles.length < 50) {
        suspiciousFiles.forEach(file => {
          addIssue('LOW', 'PERMISSIONS', 'World-writable file detected (review if intentional)', file);
        });
      } else if (suspiciousFiles.length >= 50) {
        addIssue('LOW', 'PERMISSIONS', `Many world-writable files detected (${suspiciousFiles.length}) - likely development environment`);
      }
    }
  } catch (error) {
    addIssue('LOW', 'PERMISSIONS', `Permission check failed: ${error.message}`);
  }
}

function checkDependencies() {
  console.log('\n📦 Checking dependencies...');
  
  try {
    const auditResult = execSync('pnpm audit --json', { encoding: 'utf8' });
    const audit = JSON.parse(auditResult);
    
    if (audit.metadata && audit.metadata.vulnerabilities) {
      const vulns = audit.metadata.vulnerabilities;
      if (vulns.high > 0) {
        addIssue('HIGH', 'DEPENDENCIES', `${vulns.high} high-severity vulnerabilities found`);
      }
      if (vulns.critical > 0) {
        addIssue('CRITICAL', 'DEPENDENCIES', `${vulns.critical} critical vulnerabilities found`);
      }
      if (vulns.moderate > 0) {
        addIssue('MEDIUM', 'DEPENDENCIES', `${vulns.moderate} moderate vulnerabilities found`);
      }
    }
  } catch (error) {
    addIssue('MEDIUM', 'DEPENDENCIES', 'Dependency audit failed or vulnerabilities found');
  }
}

function checkEnvironmentFiles() {
  console.log('\n🌍 Checking environment files...');
  
  const envFiles = ['.env', '.env.local', '.env.production', '.env.development'];
  
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      addIssue('CRITICAL', 'SECRETS', `Environment file ${envFile} should not be committed`, envFile);
    }
  }
  
  // Check if .env.example exists and has proper documentation
  if (!fs.existsSync('.env.example')) {
    addIssue('MEDIUM', 'DOCUMENTATION', '.env.example file missing');
  }
}

function checkGitIgnore() {
  console.log('\n📝 Checking .gitignore...');
  
  if (!fs.existsSync('.gitignore')) {
    addIssue('HIGH', 'CONFIGURATION', '.gitignore file missing');
    return;
  }
  
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const requiredPatterns = ['.env*', 'node_modules', '*.log', '.DS_Store'];
  
  for (const pattern of requiredPatterns) {
    if (!gitignore.includes(pattern)) {
      addIssue('MEDIUM', 'CONFIGURATION', `.gitignore missing pattern: ${pattern}`);
    }
  }
}

function generateReport() {
  console.log('\n📊 Security Scan Results');
  console.log('='.repeat(50));
  
  if (issues.length === 0 && warnings.length === 0) {
    console.log('✅ No security issues found!');
    return;
  }
  
  if (issues.length > 0) {
    console.log(`\n🚨 ISSUES FOUND (${issues.length}):`);
    issues.forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.severity}] ${issue.category}: ${issue.message}`);
      if (issue.file) console.log(`   File: ${issue.file}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach((warning, i) => {
      console.log(`${i + 1}. [${warning.severity}] ${warning.category}: ${warning.message}`);
      if (warning.file) console.log(`   File: ${warning.file}`);
    });
  }
  
  // Generate JSON report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues: issues.length,
      totalWarnings: warnings.length,
      criticalIssues: issues.filter(i => i.severity === 'CRITICAL').length,
      highIssues: issues.filter(i => i.severity === 'HIGH').length,
    },
    issues,
    warnings
  };
  
  fs.writeFileSync('security-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to security-report.json');
  
  // Exit with error code if critical or high issues found
  const criticalOrHigh = issues.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH');
  if (criticalOrHigh.length > 0) {
    console.log(`\n❌ Security scan failed: ${criticalOrHigh.length} critical/high issues found`);
    process.exit(1);
  } else {
    console.log('\n✅ Security scan passed: No critical or high issues found');
  }
}

// Run all security checks
async function main() {
  try {
    scanFiles();
    checkFilePermissions();
    checkDependencies();
    checkEnvironmentFiles();
    checkGitIgnore();
    generateReport();
  } catch (error) {
    console.error('❌ Security scan failed:', error.message);
    process.exit(1);
  }
}

main();