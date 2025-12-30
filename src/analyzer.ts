/**
 * Factorio Blueprint Analyzer
 * Analyzes production rates, bottlenecks, and external I/O
 */

import type {
  Blueprint,
  BlueprintEntity,
  Position,
  Recipe,
  Module,
  AnalyzedMachine,
  AnalyzedBeacon,
  AnalysisResult,
} from "./types.js";
import {
  getMachine,
  getModule,
  getRecipe,
  getBeacon,
  isProductionMachine,
  isBeacon,
  isStorageEntity,
  isRailEntity,
  getDisplayName,
} from "./gameData.js";

/**
 * Tolerance for floating-point comparison when checking if production exceeds/falls short of demand.
 * Using 1.0001 means we consider values within 0.01% as equal to avoid floating-point precision issues.
 */
const FLOW_COMPARISON_TOLERANCE = 1.0001;

/**
 * Minimum change threshold for utilization updates.
 * Changes smaller than this are ignored to prevent infinite loops from tiny adjustments.
 */
const UTILIZATION_CHANGE_THRESHOLD = 0.0001;

/**
 * Maximum iterations for bottleneck resolution.
 * This limit ensures the algorithm terminates even for complex or cyclic production chains.
 * In practice, most production chains converge within 5-10 iterations.
 */
const MAX_BOTTLENECK_ITERATIONS = 30;

/**
 * Calculates distance between two positions
 */
function distance(p1: Position, p2: Position): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

/**
 * Checks if a beacon affects a machine based on positions and sizes
 */
function beaconAffectsMachine(
  beaconPos: Position,
  beaconRange: number,
  machinePos: Position,
  machineSize: { width: number; height: number }
): boolean {
  // Calculate the bounding boxes
  const beaconSize = 3; // Beacon is 3x3
  const beaconLeft = beaconPos.x - beaconSize / 2;
  const beaconRight = beaconPos.x + beaconSize / 2;
  const beaconTop = beaconPos.y - beaconSize / 2;
  const beaconBottom = beaconPos.y + beaconSize / 2;

  const machineLeft = machinePos.x - machineSize.width / 2;
  const machineRight = machinePos.x + machineSize.width / 2;
  const machineTop = machinePos.y - machineSize.height / 2;
  const machineBottom = machinePos.y + machineSize.height / 2;

  // Calculate the effective beacon range area
  const rangeLeft = beaconLeft - beaconRange;
  const rangeRight = beaconRight + beaconRange;
  const rangeTop = beaconTop - beaconRange;
  const rangeBottom = beaconBottom + beaconRange;

  // Check if machine overlaps with beacon's range area
  return (
    machineLeft < rangeRight &&
    machineRight > rangeLeft &&
    machineTop < rangeBottom &&
    machineBottom > rangeTop
  );
}

/**
 * Extracts modules from a blueprint entity
 */
function extractModules(entity: BlueprintEntity): Module[] {
  const modules: Module[] = [];

  if (!entity.items) return modules;

  for (const item of entity.items) {
    const moduleDef = getModule(item.id.name);
    if (moduleDef) {
      // Count how many of this module are installed
      const count = item.items.in_inventory.length;
      for (let i = 0; i < count; i++) {
        modules.push(moduleDef);
      }
    }
  }

  return modules;
}

/**
 * Calculates effective speed and productivity for a machine
 * Considers internal modules and beacon effects
 * Beacon effects use diminishing returns: total effect is divided by sqrt(n) where n is number of beacons
 */
function calculateEffectiveStats(
  machine: ReturnType<typeof getMachine>,
  modules: Module[],
  beacons: AnalyzedBeacon[]
): { speed: number; productivity: number } {
  if (!machine) {
    return { speed: 1, productivity: 1 };
  }

  let speedBonus = 0;
  let productivityBonus = machine.baseProductivity;

  // Apply internal modules
  for (const module of modules) {
    speedBonus += module.effects.speed ?? 0;
    productivityBonus += module.effects.productivity ?? 0;
  }

  // Apply beacon effects with diminishing returns
  // Formula: sum of all beacon module effects * transmission / sqrt(numBeacons)
  const beaconDef = getBeacon("beacon");
  if (beaconDef && beacons.length > 0) {
    const transmissionEff = beaconDef.transmissionEfficiency;
    const diminishingFactor = 1 / Math.sqrt(beacons.length);
    
    let beaconSpeedBonus = 0;
    let beaconProdBonus = 0;
    
    for (const beacon of beacons) {
      for (const module of beacon.modules) {
        beaconSpeedBonus += module.effects.speed ?? 0;
        beaconProdBonus += module.effects.productivity ?? 0;
      }
    }
    
    // Apply transmission efficiency and diminishing returns
    speedBonus += beaconSpeedBonus * transmissionEff * diminishingFactor;
    productivityBonus += beaconProdBonus * transmissionEff * diminishingFactor;
  }

  // Speed cannot go below 20%
  const speedMultiplier = Math.max(0.2, 1 + speedBonus);
  const effectiveSpeed = machine.craftingSpeed * speedMultiplier;
  const effectiveProductivity = 1 + productivityBonus;

  return { speed: effectiveSpeed, productivity: effectiveProductivity };
}

/**
 * Main analyzer class
 */
export class BlueprintAnalyzer {
  private blueprint: Blueprint;
  private machines: Map<number, AnalyzedMachine> = new Map();
  private beacons: Map<number, AnalyzedBeacon> = new Map();
  private itemFlows: Map<string, { produced: number; consumed: number }> = new Map();

  constructor(blueprint: Blueprint) {
    this.blueprint = blueprint;
  }

  /**
   * Analyzes the blueprint and returns the analysis result
   */
  analyze(filename: string): AnalysisResult {
    // Step 1: Identify all beacons and their modules
    this.analyzeBeacons();

    // Step 2: Identify all production machines
    this.analyzeProductionMachines();

    // Step 3: Calculate production rates for each machine
    this.calculateProductionRates();

    // Step 4: Identify external sources and sinks
    const { inputs, outputs } = this.identifyExternalFlows();

    // Step 5: Calculate utilization
    const utilization = this.calculateUtilization();

    return {
      filename,
      externalInputs: inputs,
      externalOutputs: outputs,
      machines: Array.from(this.machines.values()),
      utilization,
    };
  }

  private analyzeBeacons(): void {
    for (const entity of this.blueprint.entities) {
      if (isBeacon(entity.name)) {
        const beaconDef = getBeacon(entity.name);
        if (!beaconDef) continue;

        const modules = extractModules(entity);

        this.beacons.set(entity.entity_number, {
          entityNumber: entity.entity_number,
          position: entity.position,
          modules,
          transmissionFactor: beaconDef.transmissionEfficiency,
        });
      }
    }
  }

  private analyzeProductionMachines(): void {
    for (const entity of this.blueprint.entities) {
      if (!isProductionMachine(entity.name)) continue;

      const machineDef = getMachine(entity.name);
      if (!machineDef) continue;

      const recipe = entity.recipe ? getRecipe(entity.recipe) : null;
      const modules = extractModules(entity);

      // Find affecting beacons
      const affectingBeacons: AnalyzedBeacon[] = [];
      for (const [, beacon] of this.beacons) {
        if (
          beaconAffectsMachine(
            beacon.position,
            getBeacon("beacon")?.range ?? 3,
            entity.position,
            machineDef.size
          )
        ) {
          affectingBeacons.push(beacon);
        }
      }

      const { speed, productivity } = calculateEffectiveStats(
        machineDef,
        modules,
        affectingBeacons
      );

      this.machines.set(entity.entity_number, {
        entityNumber: entity.entity_number,
        machineName: machineDef.name,
        machineType: entity.name,
        recipe: recipe ?? null,
        position: entity.position,
        modules,
        affectingBeacons,
        effectiveSpeed: speed,
        effectiveProductivity: productivity,
        inputRates: new Map(),
        outputRates: new Map(),
        utilization: 1.0, // Default to 100%, will be adjusted for bottlenecks
        bottleneckedBy: null,
      });
    }
  }

  private calculateProductionRates(): void {
    // First pass: Calculate max production capacity for each machine
    for (const [, machine] of this.machines) {
      if (!machine.recipe) continue;

      const recipe = machine.recipe;
      const cyclesPerSecond = machine.effectiveSpeed / recipe.craftingTime;

      // Calculate max input consumption rates
      for (const ingredient of recipe.ingredients) {
        const rate = ingredient.amount * cyclesPerSecond;
        machine.inputRates.set(ingredient.name, rate);
      }

      // Calculate max output production rates (with productivity bonus)
      for (const product of recipe.products) {
        const rate =
          product.amount *
          cyclesPerSecond *
          machine.effectiveProductivity *
          (product.probability ?? 1);
        machine.outputRates.set(product.name, rate);
      }
    }

    // Second pass: Iteratively resolve bottlenecks
    // This handles demand-limited production chains
    this.resolveBottlenecks();

    // Third pass: Calculate actual item flows after bottleneck resolution
    for (const [, machine] of this.machines) {
      if (!machine.recipe) continue;

      // Apply utilization to get actual rates
      for (const [item, maxRate] of machine.inputRates) {
        const actualRate = maxRate * machine.utilization;
        const flow = this.itemFlows.get(item) ?? { produced: 0, consumed: 0 };
        flow.consumed += actualRate;
        this.itemFlows.set(item, flow);
      }

      for (const [item, maxRate] of machine.outputRates) {
        const actualRate = maxRate * machine.utilization;
        const flow = this.itemFlows.get(item) ?? { produced: 0, consumed: 0 };
        flow.produced += actualRate;
        this.itemFlows.set(item, flow);
      }
    }
  }

  private resolveBottlenecks(): void {
    // The correct approach: Work backwards from final outputs
    // 1. Final output machines run at 100% (unless supply-limited)
    // 2. Calculate required inputs for each machine
    // 3. Upstream machines produce only what's needed
    
    // First, identify which items are consumed internally
    const itemConsumers = new Map<string, number[]>();
    const itemProducers = new Map<string, number[]>();
    
    for (const [entityNum, machine] of this.machines) {
      if (!machine.recipe) continue;
      
      for (const [item] of machine.inputRates) {
        const consumers = itemConsumers.get(item) ?? [];
        consumers.push(entityNum);
        itemConsumers.set(item, consumers);
      }
      
      for (const [item] of machine.outputRates) {
        const producers = itemProducers.get(item) ?? [];
        producers.push(entityNum);
        itemProducers.set(item, producers);
      }
    }
    
    // Identify final output items (produced but not consumed internally)
    const finalOutputItems = new Set<string>();
    for (const [item] of itemProducers) {
      if (!itemConsumers.has(item)) {
        finalOutputItems.add(item);
      }
    }
    
    // Iterative resolution - work backwards from final outputs
    for (let iteration = 0; iteration < MAX_BOTTLENECK_ITERATIONS; iteration++) {
      let changed = false;
      
      // Calculate required demand for each item based on current utilization
      const requiredInput = new Map<string, number>();
      for (const [, machine] of this.machines) {
        if (!machine.recipe) continue;
        for (const [item, rate] of machine.inputRates) {
          requiredInput.set(item, (requiredInput.get(item) ?? 0) + rate * machine.utilization);
        }
      }
      
      // Calculate max production capacity
      const maxProduction = new Map<string, number>();
      for (const [, machine] of this.machines) {
        if (!machine.recipe) continue;
        for (const [item, rate] of machine.outputRates) {
          maxProduction.set(item, (maxProduction.get(item) ?? 0) + rate);
        }
      }
      
      // Step 1: Check for supply bottlenecks
      // If max production < required, scale down consumers
      for (const [item, required] of requiredInput) {
        const maxProd = maxProduction.get(item) ?? 0;
        if (maxProd > 0 && required > maxProd * FLOW_COMPARISON_TOLERANCE) {
          const ratio = maxProd / required;
          for (const [, machine] of this.machines) {
            if (machine.inputRates.has(item)) {
              const newUtil = machine.utilization * ratio;
              if (newUtil < machine.utilization - UTILIZATION_CHANGE_THRESHOLD) {
                machine.utilization = newUtil;
                machine.bottleneckedBy = `${getDisplayName(item)} shortage`;
                changed = true;
              }
            }
          }
        }
      }
      
      // Recalculate required input after supply adjustments
      const adjustedInput = new Map<string, number>();
      for (const [, machine] of this.machines) {
        if (!machine.recipe) continue;
        for (const [item, rate] of machine.inputRates) {
          adjustedInput.set(item, (adjustedInput.get(item) ?? 0) + rate * machine.utilization);
        }
      }
      
      // Step 2: Demand-limit upstream producers
      // Producers should match what's needed by consumers
      for (const [item, needed] of adjustedInput) {
        const maxProd = maxProduction.get(item) ?? 0;
        if (maxProd > needed * FLOW_COMPARISON_TOLERANCE) {
          // Scale down producers to match demand
          const targetRatio = needed / maxProd;
          const producers = itemProducers.get(item) ?? [];
          for (const entityNum of producers) {
            const machine = this.machines.get(entityNum);
            if (machine && machine.utilization > targetRatio + UTILIZATION_CHANGE_THRESHOLD) {
              machine.utilization = targetRatio;
              machine.bottleneckedBy = `Demand limited (${getDisplayName(item)})`;
              changed = true;
            }
          }
        }
      }
      
      if (!changed) break;
    }
    
    // Clear bottleneck messages for machines at ~100% utilization
    for (const [, machine] of this.machines) {
      if (machine.utilization > 0.999) {
        machine.bottleneckedBy = null;
      }
    }
  }

  private identifyExternalFlows(): {
    inputs: Map<string, number>;
    outputs: Map<string, number>;
  } {
    const inputs = new Map<string, number>();
    const outputs = new Map<string, number>();

    // Check for train/chest/belt sources
    const hasRails = this.blueprint.entities.some((e) => isRailEntity(e.name));
    const hasChests = this.blueprint.entities.some((e) =>
      isStorageEntity(e.name)
    );

    for (const [item, flow] of this.itemFlows) {
      // Apply utilization to flows
      const adjustedConsumed = flow.consumed;
      const adjustedProduced = flow.produced;

      if (adjustedConsumed > adjustedProduced) {
        // Net consumption - this is an external input
        const netInput = adjustedConsumed - adjustedProduced;
        inputs.set(item, netInput);
      } else if (adjustedProduced > adjustedConsumed) {
        // Net production - this is an external output
        const netOutput = adjustedProduced - adjustedConsumed;
        outputs.set(item, netOutput);
      }
    }

    return { inputs, outputs };
  }

  private calculateUtilization(): Map<
    string,
    { count: number; avgUtilization: number }
  > {
    const utilMap = new Map<
      string,
      { count: number; totalUtilization: number }
    >();

    for (const [, machine] of this.machines) {
      if (!machine.recipe) continue;

      const key = `${machine.machineName} (${machine.recipe.name})`;
      const existing = utilMap.get(key) ?? { count: 0, totalUtilization: 0 };
      existing.count++;
      existing.totalUtilization += machine.utilization;
      utilMap.set(key, existing);
    }

    const result = new Map<string, { count: number; avgUtilization: number }>();
    for (const [key, data] of utilMap) {
      result.set(key, {
        count: data.count,
        avgUtilization: data.totalUtilization / data.count,
      });
    }

    return result;
  }
}

/**
 * Formats the analysis result for output
 */
export function formatAnalysisResult(result: AnalysisResult): string {
  const lines: string[] = [];

  lines.push("—");
  lines.push(`Analyzed ${result.filename}`);
  lines.push("");

  // Format inputs
  const inputParts: string[] = [];
  for (const [item, rate] of result.externalInputs) {
    inputParts.push(`${getDisplayName(item)} (${rate.toFixed(2)}/s)`);
  }
  if (inputParts.length > 0) {
    lines.push(`Inputs: ${inputParts.join(", ")}`);
  } else {
    lines.push("Inputs: None");
  }

  // Format outputs
  const outputParts: string[] = [];
  for (const [item, rate] of result.externalOutputs) {
    outputParts.push(`${getDisplayName(item)} (${rate.toFixed(2)}/s)`);
  }
  if (outputParts.length > 0) {
    lines.push(`Outputs: ${outputParts.join(", ")}`);
  } else {
    lines.push("Outputs: None");
  }

  lines.push("");
  lines.push("Utilization:");

  // Sort by utilization descending
  const sortedUtil = Array.from(result.utilization.entries()).sort(
    (a, b) => b[1].avgUtilization - a[1].avgUtilization
  );

  for (const [key, data] of sortedUtil) {
    const percent = (data.avgUtilization * 100).toFixed(0);
    lines.push(` ${key} x${data.count}: ${percent}%`);
  }

  lines.push("—");

  return lines.join("\n");
}
