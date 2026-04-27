const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function resolveConflictsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to match conflict blocks
  // <<<<<<< HEAD\n(content1)=======\n(content2)>>>>>>> [hash or branch]\n
  const conflictRegex = /<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>>[^\n]*\n/g;
  
  if (!conflictRegex.test(content)) return false;
  
  const resolvedContent = content.replace(conflictRegex, '$1');
  fs.writeFileSync(filePath, resolvedContent, 'utf8');
  return true;
}

function findConflictedFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === '.next') continue;
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findConflictedFiles(filePath));
    } else {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('<<<<<<< HEAD')) {
          results.push(filePath);
        }
      } catch (e) {
        // Skip files that can't be read as utf8
      }
    }
  }
  return results;
}

const dir = process.cwd();
console.log(`Scanning for conflicted files in ${dir}...`);
const files = findConflictedFiles(dir);

if (files.length === 0) {
  console.log('No conflicted files found.');
} else {
  files.forEach(file => {
    console.log(`Resolving conflicts in ${path.relative(dir, file)}`);
    resolveConflictsInFile(file);
  });
  console.log('All conflicts resolved by accepting HEAD.');
}
