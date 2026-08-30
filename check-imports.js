const fs = require('fs');
const path = require('path');

function getAllFiles(dir, allFiles = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'build') {
        getAllFiles(fullPath, allFiles);
      }
    } else if (/\.(js|jsx|css|json)$/.test(entry.name)) {
      allFiles.push(fullPath);
    }
  }
  return allFiles;
}

const rootDir = path.resolve('.');
const files = getAllFiles(path.resolve('src'));
let issues = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /(?:import\s+(?:[\w*\s{},]*\s+from\s+)?|import\s*\(|require\()\s*['"](\.[^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    const dir = path.dirname(file);
    let resolved = path.resolve(dir, importPath);

    const exts = ['', '.js', '.jsx', '.json', '.css', '/index.js', '/index.jsx'];
    let foundExact = false;
    let foundCaseMismatch = false;
    let details = '';

    for (const ext of exts) {
      const candidate = resolved + ext;
      const cDir = path.dirname(candidate);
      const cBase = path.basename(candidate);
      if (fs.existsSync(cDir)) {
        const actualEntries = fs.readdirSync(cDir);
        const matchEntry = actualEntries.find(e => e.toLowerCase() === cBase.toLowerCase());
        if (matchEntry) {
          if (matchEntry !== cBase) {
            foundCaseMismatch = true;
            details = `Base file mismatch: expected '${matchEntry}', imported '${cBase}'`;
          } else {
            // Check all path segments casing
            let relativeCandidate = path.relative(rootDir, candidate);
            let parts = relativeCandidate.split(path.sep);
            let currentPath = rootDir;
            for (const part of parts) {
              const siblings = fs.readdirSync(currentPath);
              if (!siblings.includes(part)) {
                const actualCase = siblings.find(s => s.toLowerCase() === part.toLowerCase());
                foundCaseMismatch = true;
                details = `Directory casing mismatch: '${part}' vs actual '${actualCase}' in ${currentPath}`;
                break;
              }
              currentPath = path.join(currentPath, part);
            }
            if (!foundCaseMismatch) {
              foundExact = true;
            }
          }
          break;
        }
      }
    }

    if (foundCaseMismatch) {
      issues.push({ file: path.relative(rootDir, file), importPath, issue: 'Case mismatch', details });
    } else if (!foundExact) {
      issues.push({ file: path.relative(rootDir, file), importPath, issue: 'File not found' });
    }
  }
});

console.log('--- CHECK RESULTS ---');
console.log('Total files checked:', files.length);
console.log('Issues found:', issues.length);
if (issues.length > 0) {
  console.log(JSON.stringify(issues, null, 2));
} else {
  console.log('No local relative import casing issues found!');
}
