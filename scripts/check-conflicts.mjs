import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const markers = ['<'.repeat(7), '='.repeat(7), '>'.repeat(7)];
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'coverage']);
const ignoredExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) files.push(...await walk(join(directory, entry.name)));
      continue;
    }

    if ([...ignoredExtensions].some(extension => entry.name.endsWith(extension))) continue;
    files.push(join(directory, entry.name));
  }

  return files;
}

const files = await walk(process.cwd());
const conflicts = [];

for (const file of files) {
  const contents = await readFile(file, 'utf8');
  const lines = contents.split('\n');
  lines.forEach((line, index) => {
    if (markers.some(marker => line.includes(marker))) conflicts.push(`${file}:${index + 1}: ${line.trim()}`);
  });
}

if (conflicts.length) {
  console.error('Merge conflict markers found:');
  console.error(conflicts.join('\n'));
  process.exit(1);
}

console.log('No merge conflict markers found.');
