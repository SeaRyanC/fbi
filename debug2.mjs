import { BlueprintAnalyzer } from './dist/analyzer.js';
import { decodeBlueprint } from './dist/decoder.js';
import { readFileSync } from 'fs';
import { getRecipe, getMachine } from './dist/gameData.js';

const blueprintString = readFileSync('tests/emsci2.txt', 'utf8').trim();
const decoded = decodeBlueprint(blueprintString);
const bp = decoded.blueprint;

// Find entity 32
const entity32 = bp.entities.find(e => e.entity_number === 32);
console.log('Entity 32:', entity32);

// Get recipe
const recipe = getRecipe('holmium-solution');
console.log('\nHolmium solution recipe:', recipe);

// Get machine
const machine = getMachine('chemical-plant');
console.log('\nChemical plant:', machine);

// Now run the analyzer to see what it calculates
const analyzer = new BlueprintAnalyzer(bp);
const result = analyzer.analyze('emsci2.txt');

// Find the machine analysis for entity 32
const analyzedMachine = result.machines.find(m => m.entityNumber === 32);
if (analyzedMachine) {
  console.log('\nAnalyzed machine 32:');
  console.log('  Effective speed:', analyzedMachine.effectiveSpeed);
  console.log('  Effective productivity:', analyzedMachine.effectiveProductivity);
  console.log('  Utilization:', analyzedMachine.utilization);
  console.log('  Input rates:', Array.from(analyzedMachine.inputRates.entries()));
  console.log('  Output rates:', Array.from(analyzedMachine.outputRates.entries()));
}
