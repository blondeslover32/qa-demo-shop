// Run from an isolated COPY of demo/fallback-shop, never from the baseline.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
const issue = process.argv[2];
if (!existsSync('.replay-checkout')) throw new Error('Create an isolated copy with copy-replay.mjs first.');
const changes = issue === '742' ? [
  ['lib/cart-count.ts', 'return items.reduce((total, item) => total + item.quantity, 0);', 'return items.length;']
] : issue === '955' ? [
  ['components/order-note.tsx', /import \{ storeSettings \} from ["']\.\.\/lib\/store-settings["'];/, ''],
  ['components/order-note.tsx', /export function OrderNote\(\) \{[\s\S]*\n\}/, 'export function OrderNote() {\n  return null;\n}']
] : null;
if (!changes) throw new Error('Usage: node prepare-replay.mjs 742|955');
const files = new Map();
for (const [file, before, after] of changes) {
  const source = files.get(file) ?? readFileSync(file, 'utf8');
  if (typeof before === 'string' ? source.split(before).length !== 2 : !before.test(source)) throw new Error(`Expected one patch target in ${file}`);
  files.set(file, source.replace(before, after));
}
for (const [file, source] of files) writeFileSync(file, source);
console.log(JSON.stringify({ replay: issue, files: [...files.keys()] }));
