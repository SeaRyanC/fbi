import { BlueprintAnalyzer } from './dist/analyzer.js';
import { decodeBlueprint } from './dist/decoder.js';
import { readFileSync } from 'fs';

const blueprintString = readFileSync('tests/emsci2.txt', 'utf8').trim();
const decoded = decodeBlueprint(blueprintString);
const bp = decoded.blueprint;

// Find all beacons
const beacons = bp.entities.filter(e => e.name === 'beacon');
console.log('Beacons:', beacons.length);

// Find entity 32 and nearby entities
const entity32 = bp.entities.find(e => e.entity_number === 32);
console.log('Entity 32 position:', entity32.position);

// Check which beacons affect entity 32
for (const beacon of beacons) {
  const dist = Math.sqrt(
    (beacon.position.x - entity32.position.x) ** 2 +
    (beacon.position.y - entity32.position.y) ** 2
  );
  console.log(`Beacon ${beacon.entity_number} at (${beacon.position.x}, ${beacon.position.y}), distance: ${dist}`);
  if (beacon.items) {
    console.log('  Modules:', beacon.items.map(i => `${i.id.name} x${i.items.in_inventory.length}`).join(', '));
  }
}

// Run full analysis
const analyzer = new BlueprintAnalyzer(bp);
const result = analyzer.analyze('emsci2.txt');

const analyzedMachine = result.machines.find(m => m.entityNumber === 32);
if (analyzedMachine) {
  console.log('\nAnalyzed machine 32:');
  console.log('  Affecting beacons:', analyzedMachine.affectingBeacons.length);
  console.log('  Modules:', analyzedMachine.modules.map(m => m.internalName));
}
