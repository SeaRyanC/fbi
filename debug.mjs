import { decodeBlueprint } from './dist/decoder.js';
import { readFileSync } from 'fs';

const blueprintString = readFileSync('tests/emsci2.txt', 'utf8').trim();
const decoded = decodeBlueprint(blueprintString);
const bp = decoded.blueprint;

console.log('Entities count:', bp.entities.length);

// Find all machines
const machines = bp.entities.filter(e => 
  e.name.includes('plant') || 
  e.name.includes('foundry')
);

for (const m of machines) {
  console.log(`Entity ${m.entity_number}: ${m.name}, recipe: ${m.recipe}`);
  if (m.items) {
    console.log('  Modules:', m.items.map(i => i.id.name).join(', '));
  }
}

// Find all pipes
const pipes = bp.entities.filter(e => e.name === 'pipe' || e.name.includes('pipe'));
console.log('\nPipe-related entities:', pipes.length);

// Find inserters
const inserters = bp.entities.filter(e => 
  e.name.includes('inserter')
);
console.log('Inserters:', inserters.length);
