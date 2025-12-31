# FBI - Factorio Blueprint Investigator

A command-line TypeScript application that analyzes Factorio blueprints and calculates production rates, external inputs/outputs, and machine utilization.

## Features

- Decodes Factorio blueprint strings (base64 + zlib compressed)
- Supports both single blueprints and blueprint books
- Calculates effective machine speeds considering:
  - Base machine crafting speed
  - Internal modules (speed, productivity, efficiency)
  - Beacon effects with Space Age (2.0) transmission efficiency
- Identifies external sources and sinks
- Calculates production bottlenecks and machine utilization
- Supports Space Age expansion recipes and machines

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
npm run analyze <blueprint-file>
# or
node dist/index.js <blueprint-file>
```

### Example

```bash
node dist/index.js sample.txt
```

Output:
```
Processing 1 blueprint(s)...

—
Analyzed sample.txt

Inputs: Iron Ore (0.16/s), Calcite (0.00/s), Copper Plate (0.35/s)
Outputs: Automation Science Pack (0.49/s)

Utilization:
 Assembling Machine 3 (Automation Science Pack) x1: 100%
 Foundry (Casting Iron Gear Wheel) x1: 4%
 Foundry (Molten Iron) x1: 2%
—
```

## How It Works

1. **Blueprint Decoding**: Reads the blueprint string, strips the version byte, base64 decodes, and decompresses with zlib.

2. **Machine Analysis**: Identifies all production machines and calculates their effective speed and productivity based on:
   - Base machine stats
   - Installed modules
   - Affecting beacons (with 50% transmission efficiency in Space Age)

3. **Flow Analysis**: Tracks item/fluid production and consumption across all machines to identify:
   - External inputs (items consumed but not produced internally)
   - External outputs (items produced but not consumed internally)

4. **Bottleneck Resolution**: Iteratively adjusts machine utilization to account for:
   - Supply constraints (upstream production < consumption)
   - Demand constraints (downstream consumption < production)

## Supported Machines

- Assembling Machine 1/2/3
- Foundry
- Chemical Plant
- Electric Furnace
- Centrifuge
- Electromagnetic Plant
- Cryogenic Plant
- Biochamber
- Crusher

## Supported Modules

- Speed Module 1/2/3
- Productivity Module 1/2/3
- Efficiency Module 1/2/3
- Quality Module 1/2/3 (Space Age)

## Space Age Considerations

This investigator uses Space Age (Factorio 2.0) mechanics:
- Beacon transmission efficiency: 150% (1.5x module effects)
- Beacon diminishing returns: Total effect divided by sqrt(number of beacons)
- Foundry base productivity: 50%
- Electromagnetic Plant base productivity: 50%
- New recipes: Molten iron/copper, Casting recipes, etc.

## Development

```bash
# Build
npm run build

# Run tests
npm test
```

## License

ISC