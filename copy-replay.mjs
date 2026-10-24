import { cpSync, existsSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const [issue, targetInput] = process.argv.slice(2);
if (!['742', '955'].includes(issue) || !targetInput) throw new Error('Usage: node copy-replay.mjs 742|955 /absolute/unused/path');
const source = import.meta.dirname;
const target = resolve(targetInput);
if (existsSync(target) || target.startsWith(source + '/')) throw new Error('Replay target must be a new directory outside the baseline.');
const ignored = new Set(['.git', 'node_modules', '.next', 'artifacts', 'test-results', '.replay-checkout']);
cpSync(source, target, { recursive: true, filter: (path) => !ignored.has(basename(path)) });
// Turbopack intentionally refuses dependencies symlinked outside its project root.
cpSync(resolve(source, 'node_modules'), resolve(target, 'node_modules'), { recursive: true });
writeFileSync(resolve(target, '.replay-checkout'), JSON.stringify({ issue, source }));
const result = spawnSync(process.execPath, ['prepare-replay.mjs', issue], { cwd: target, stdio: 'inherit' });
process.exitCode = result.status ?? 1;
