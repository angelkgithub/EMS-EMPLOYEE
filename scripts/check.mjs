// Pre-deploy check: reads public/assets/js/data.js and reports
// missing files, empty links and obvious mistakes. Run:  npm run check
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(readFileSync(join(root, 'assets/js/data.js'), 'utf8'), ctx);
const D = ctx.window.EMS_DATA;

const errors = [], todo = [];
const local = (label, p) => {
  if (!p) return todo.push(label);
  if (p.startsWith('/')) { if (!existsSync(join(root, p))) errors.push(`${label}: file not found (${p})`); }
  else if (!/^https:\/\//.test(p)) errors.push(`${label}: must start with https:// or / (${p})`);
};
const web = (label, p) => { if (!p) return todo.push(label); if (!/^https:\/\//.test(p)) errors.push(`${label}: must start with https:// (${p})`); };

const ids = new Set();
for (const t of D.TOOLS) {
  if (ids.has(t.id)) errors.push(`Tool id used twice: ${t.id}`); ids.add(t.id);
  if (!D.GROUPS.some(g => g.id === t.group)) errors.push(`${t.name}: unknown group "${t.group}"`);
  if (t.formats) t.formats.forEach(f => web(`${t.name} (${f.label})`, f.url)); else web(t.name, t.url);
}
for (const id of D.DEFAULT_PINS) if (!ids.has(id)) errors.push(`DEFAULT_PINS has unknown tool "${id}"`);
D.VIDEOS.forEach(v => { if (!v.youtube) todo.push(`Video: ${v.title}`); else if (!/(youtu\.be\/|v=|embed\/|shorts\/|live\/)[\w-]{11}/.test(v.youtube)) errors.push(`Video "${v.title}": can't find a YouTube ID in the link`); });
D.RECORDINGS.forEach(r => { if (!r.src) todo.push(`Recording: ${r.title}`); else if (!r.src.startsWith('/') || !/\.(mp3|m4a|wav|ogg)$/i.test(r.src)) errors.push(`${r.title}: use a file in /assets/audio/ ending in .mp3`); else local(r.title, r.src); });
(function walk(p) { if (p.photo) local(`Photo for ${p.name}`, p.photo); if (/^\[/.test(p.name)) todo.push(`Org chart: ${p.role} still has a placeholder name`); if (p.partner) walk(p.partner); (p.children || []).forEach(walk); })(D.ORG);
D.SALES_TEAM.forEach(p => { if (p.photo) local(`Photo for ${p.name}`, p.photo); });
local('House rules PDF', D.RULES_PDF.url);
D.RULE_SECTIONS.forEach(s => { if (/^\[/.test(s.body)) todo.push(`House rules summary: "${s.title}"`); });

if (todo.length) console.log(`\nStill to add (${todo.length}):\n` + todo.map(t => '  - ' + t).join('\n'));
if (errors.length) { console.error(`\nProblems (${errors.length}):\n` + errors.map(e => '  x ' + e).join('\n')); process.exit(1); }
console.log('\nNo broken links or missing files.');
