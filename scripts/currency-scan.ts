#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';

interface CurrencyMatch {
  file: string;
  line: number;
  match: string;
  context: string;
}

const patterns: { name: string; regex: RegExp }[] = [
  { name: 'raw_rupee_prefix', regex: /₹\s*\d[\d,.]*/g },
  { name: 'raw_rupee_suffix', regex: /\d[\d,.]*\s*₹/g },
  { name: 'raw_owp_amount', regex: /\b\d+(?:\.\d+)?\s*OWP\b/g },
  { name: 'format_missing', regex: /(?:₹\s*\d|\d\s*OWP)/g },
];

function scanFile(filePath: string): CurrencyMatch[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const matches: CurrencyMatch[] = [];
  lines.forEach((line, idx) => {
    patterns.forEach((p) => {
      const found = line.match(p.regex);
      if (found) {
        found.forEach((m) =>
          matches.push({
            file: filePath,
            line: idx + 1,
            match: `${p.name}:${m}`,
            context: line.trim(),
          })
        );
      }
    });
  });
  return matches;
}

function walk(dir: string, acc: CurrencyMatch[]): void {
  for (const entry of fs.readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts)$/.test(entry)) acc.push(...scanFile(full));
  }
}

function main() {
  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.error('src directory not found');
    process.exit(1);
  }
  const results: CurrencyMatch[] = [];
  walk(srcDir, results);

  const grouped = results.reduce<Record<string, CurrencyMatch[]>>((acc, r) => {
    acc[r.file] = acc[r.file] || [];
    acc[r.file].push(r);
    return acc;
  }, {});

  console.log('=== Currency Formatting Scan Results ===');
  Object.entries(grouped).forEach(([file, list]) => {
    console.log(`\n📄 ${path.relative(process.cwd(), file)}`);
    list.forEach((m) => {
      console.log(`  Line ${m.line}: ${m.match}`);
      console.log(`    ${m.context}`);
    });
  });
  console.log(`\nTotal matches: ${results.length}`);
  console.log('Refactor candidates should use formatOWP/formatINR/formatCurrency.');
}

if (require.main === module) {
  main();
}
