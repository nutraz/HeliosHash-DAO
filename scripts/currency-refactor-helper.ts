import * as fs from 'fs';
import * as path from 'path';

interface RefactorSuggestion {
  file: string;
  line: number;
  match: string;
  suggestion: string;
}

const RUPEE_REGEX = /₹(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)/g;
const OWP_REGEX = /(\d+(?:\.\d+)?)\s*OWP\b/g;

function analyzeFile(filePath: string): RefactorSuggestion[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const suggestions: RefactorSuggestion[] = [];

  lines.forEach((line, index) => {
    // Skip commented lines quickly
    if (/^\s*\/\//.test(line)) return;

    // Rupee values
    let match;
    while ((match = RUPEE_REGEX.exec(line)) !== null) {
      const raw = match[0];
      const amountRaw = match[1];
      const normalized = parseFloat(amountRaw.replace(/,/g, ''));
      suggestions.push({
        file: filePath,
        line: index + 1,
        match: raw,
        suggestion: `Replace '${raw}' with {formatINR(${normalized})}`,
      });
    }

    // OWP values
    while ((match = OWP_REGEX.exec(line)) !== null) {
      const raw = match[0];
      const amountRaw = match[1];
      const normalized = parseFloat(amountRaw);
      // Heuristic: skip if inside an import or type definition likely
      if (/import .*OWP/.test(line)) continue;
      suggestions.push({
        file: filePath,
        line: index + 1,
        match: raw,
        suggestion: `Replace '${raw}' with {formatOWP(${normalized})}`,
      });
    }
  });

  return suggestions;
}

function walk(dir: string, acc: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '.next')
      continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

function main() {
  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.error('src directory not found');
    process.exit(1);
  }

  const files = walk(srcDir);
  const all: RefactorSuggestion[] = [];
  files.forEach((f) => {
    try {
      all.push(...analyzeFile(f));
    } catch (e) {
      // ignore file read errors
    }
  });

  const grouped: Record<string, RefactorSuggestion[]> = {};
  all.forEach((s) => {
    const rel = path.relative(process.cwd(), s.file);
    (grouped[rel] = grouped[rel] || []).push(s);
  });

  console.log('# Currency Refactoring Suggestions\n');
  console.log('Total suggestions:', all.length);
  console.log('Files with issues:', Object.keys(grouped).length, '\n');

  Object.entries(grouped).forEach(([file, list]) => {
    console.log(`## ${file}`);
    list.forEach((item) => {
      console.log(`- Line ${item.line}: ${item.match} -> ${item.suggestion}`);
    });
    console.log();
  });
}

if (require.main === module) {
  main();
}
