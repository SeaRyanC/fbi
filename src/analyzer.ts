/**
 * Factorio Blueprint Investigator
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
  RecipeCategory,
  Problem,
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
  getRecipeByIngredient,
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
 * Minimum threshold for reporting external flows.
 * Net flows smaller than this are considered balanced and not reported as inputs/outputs.
 * This avoids reporting items with negligible differences due to floating-point precision.
 */
const EXTERNAL_FLOW_THRESHOLD = 0.0001;

/**
 * Threshold for matching positions to chests (1x1 entities).
 * Chests are centered at their position, so 0.5 tiles covers the entire chest.
 */
const CHEST_POSITION_THRESHOLD = 0.5;

/**
 * Maximum distance (in tiles) to search for nearby filtered inserters
 * when direct supply chain tracing doesn't find filters.
 */
const NEARBY_INSERTER_SEARCH_RADIUS = 10;

/**
 * List of known inserter entity types.
 */
const INSERTER_TYPES = [
  "inserter",
  "long-handed-inserter",
  "fast-inserter",
  "bulk-inserter",
  "stack-inserter",
  "burner-inserter",
];

/**
 * Checks if an entity is an inserter
 */
function isInserter(entityName: string): boolean {
  return INSERTER_TYPES.includes(entityName);
}

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
 * Gets the drop position for an inserter based on its direction.
 * In Factorio, the direction indicates where the inserter picks FROM.
 * The inserter drops on the OPPOSITE side from the pickup direction.
 * Direction: 0=North, 4=East, 8=South, 12=West
 * 
 * Coordinate system: Factorio uses screen coordinates where Y increases downward (South).
 * So North = -Y, South = +Y, East = +X, West = -X.
 * 
 * Note: This assumes standard inserter reach of 1 tile. Long-handed inserters
 * have a reach of 2 tiles but are rarely used with filters, so we use 1 tile
 * as a reasonable default that works for most cases.
 */
function getInserterDropPosition(inserter: BlueprintEntity): Position {
  const dir = inserter.direction ?? 0;
  const pos = { ...inserter.position };
  
  // Standard inserter drops 1 tile OPPOSITE to the direction it faces
  switch (dir) {
    case 0: // Facing North (picks from North) - drops to South
      pos.y += 1;
      break;
    case 4: // Facing East (picks from East) - drops to West
      pos.x -= 1;
      break;
    case 8: // Facing South (picks from South) - drops to North
      pos.y -= 1;
      break;
    case 12: // Facing West (picks from West) - drops to East
      pos.x += 1;
      break;
  }
  
  return pos;
}

/**
 * Gets the pickup position for an inserter based on its direction.
 * In Factorio, the direction indicates where the inserter picks FROM.
 * Uses standard 1-tile reach (see getInserterDropPosition for details).
 */
function getInserterPickupPosition(inserter: BlueprintEntity): Position {
  const dir = inserter.direction ?? 0;
  const pos = { ...inserter.position };
  
  // Standard inserter picks 1 tile in the direction it faces
  switch (dir) {
    case 0: // Facing North - picks from North
      pos.y -= 1;
      break;
    case 4: // Facing East - picks from East
      pos.x += 1;
      break;
    case 8: // Facing South - picks from South
      pos.y += 1;
      break;
    case 12: // Facing West - picks from West
      pos.x -= 1;
      break;
  }
  
  return pos;
}

/**
 * Checks if a position is within a machine's bounds
 */
function isPositionInMachine(
  pos: Position,
  machinePos: Position,
  machineSize: { width: number; height: number }
): boolean {
  const halfWidth = machineSize.width / 2;
  const halfHeight = machineSize.height / 2;
  
  return (
    pos.x >= machinePos.x - halfWidth &&
    pos.x <= machinePos.x + halfWidth &&
    pos.y >= machinePos.y - halfHeight &&
    pos.y <= machinePos.y + halfHeight
  );
}

/**
 * Infers a recipe for a machine based on inserter filters in the blueprint.
 * This is used for machines like electric furnaces that don't store their recipe in blueprints.
 * 
 * The algorithm:
 * 1. Find inserters that drop items into this machine
 * 2. If those inserters have filters, use the filtered item to infer the recipe
 * 3. If the input inserters don't have filters, trace back through chests/storage
 *    to find upstream inserters with filters
 */
function inferRecipeFromInserters(
  machine: BlueprintEntity,
  machineDef: ReturnType<typeof getMachine>,
  allEntities: BlueprintEntity[]
): Recipe | null {
  if (!machineDef) return null;
  
  // Get all inserters in the blueprint
  const inserters = allEntities.filter((e) => isInserter(e.name));
  
  // Find inserters that drop into this machine
  const inputInserters = inserters.filter((ins) => {
    const dropPos = getInserterDropPosition(ins);
    return isPositionInMachine(dropPos, machine.position, machineDef.size);
  });
  
  // Collect filtered items from input inserters
  const filteredItems = new Set<string>();
  
  for (const ins of inputInserters) {
    if (ins.filters?.length && ins.use_filters !== false) {
      for (const filter of ins.filters) {
        filteredItems.add(filter.name);
      }
    }
  }
  
  // If no direct filters found, trace back through chests
  if (filteredItems.size === 0) {
    const storageEntities = allEntities.filter((e) => isStorageEntity(e.name));
    
    for (const ins of inputInserters) {
      const pickupPos = getInserterPickupPosition(ins);
      
      // Find storage at the pickup position
      const sourceStorage = storageEntities.find((s) => {
        const dx = Math.abs(s.position.x - pickupPos.x);
        const dy = Math.abs(s.position.y - pickupPos.y);
        return dx <= CHEST_POSITION_THRESHOLD && dy <= CHEST_POSITION_THRESHOLD;
      });
      
      if (sourceStorage) {
        // Find inserters that feed into this storage
        const feedingInserters = inserters.filter((feeder) => {
          const dropPos = getInserterDropPosition(feeder);
          const dx = Math.abs(dropPos.x - sourceStorage.position.x);
          const dy = Math.abs(dropPos.y - sourceStorage.position.y);
          return dx <= CHEST_POSITION_THRESHOLD && dy <= CHEST_POSITION_THRESHOLD;
        });
        
        for (const feeder of feedingInserters) {
          if (feeder.filters?.length && feeder.use_filters !== false) {
            for (const filter of feeder.filters) {
              filteredItems.add(filter.name);
            }
          }
        }
      }
    }
  }
  
  // If still no filters, try to find any filtered inserter that might be 
  // part of the supply chain feeding this machine
  if (filteredItems.size === 0) {
    // Look for filtered inserters that are nearby and might be part of the supply chain
    const nearbyFiltered = inserters.filter((ins) => {
      if (!ins.filters?.length) return false;
      const dx = Math.abs(ins.position.x - machine.position.x);
      const dy = Math.abs(ins.position.y - machine.position.y);
      return dx <= NEARBY_INSERTER_SEARCH_RADIUS && dy <= NEARBY_INSERTER_SEARCH_RADIUS;
    });
    
    for (const ins of nearbyFiltered) {
      if (ins.filters) {
        for (const filter of ins.filters) {
          filteredItems.add(filter.name);
        }
      }
    }
  }
  
  // Now try to match filtered items to recipes in the machine's allowed categories
  for (const itemName of filteredItems) {
    for (const category of machineDef.allowedCategories) {
      const recipe = getRecipeByIngredient(itemName, category as RecipeCategory);
      if (recipe) {
        return recipe;
      }
    }
  }
  
  return null;
}

/**
 * Main analyzer class
 */
export class BlueprintAnalyzer {
  private blueprint: Blueprint;
  private machines: Map<number, AnalyzedMachine> = new Map();
  private beacons: Map<number, AnalyzedBeacon> = new Map();
  private itemFlows: Map<string, { produced: number; consumed: number }> = new Map();
  private problems: Problem[] = [];

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

    // Step 6: Check for missing input problems
    this.checkForMissingInputProblems();

    return {
      filename,
      externalInputs: inputs,
      externalOutputs: outputs,
      machines: Array.from(this.machines.values()),
      utilization,
      problems: this.problems,
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

      // Get recipe: first try explicit recipe, then infer from inserter filters
      let recipe = entity.recipe ? getRecipe(entity.recipe) : null;
      
      // Check for unknown recipe problem (recipe specified but not in game data)
      if (entity.recipe && !recipe) {
        this.problems.push({
          type: "unknown-recipe",
          message: `Unknown recipe "${entity.recipe}" on ${machineDef.name}`,
          entityNumber: entity.entity_number,
          machineName: machineDef.name,
          recipeName: entity.recipe,
        });
      }
      
      // Try to infer recipe if not found
      if (!recipe) {
        recipe = inferRecipeFromInserters(
          entity,
          machineDef,
          this.blueprint.entities
        );
      }
      
      // Check for no-recipe problem (couldn't find or infer any recipe)
      if (!recipe) {
        this.problems.push({
          type: "no-recipe",
          message: `${machineDef.name} has no recipe`,
          entityNumber: entity.entity_number,
          machineName: machineDef.name,
        });
      }
      
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

  /**
   * Returns a set of all items that are consumed by any machine in the blueprint
   */
  private getInternallyConsumedItems(): Set<string> {
    const consumedItems = new Set<string>();
    for (const [, machine] of this.machines) {
      if (!machine.recipe) continue;
      for (const [item] of machine.inputRates) {
        consumedItems.add(item);
      }
    }
    return consumedItems;
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

  /**
   * Checks if an entity is a pipe or pipe-related entity
   */
  private isPipeEntity(entityName: string): boolean {
    return entityName === 'pipe' || entityName === 'pipe-to-ground';
  }

  /**
   * Cached result of pipe network analysis to avoid recomputing
   */
  private pipeNetworkExternal: boolean | null = null;

  /**
   * Analyzes the entire pipe network topology to determine if there are external connections.
   * Returns true if there are 3+ dead-end pipes or an unconnected pipe-to-ground.
   */
  private analyzePipeNetworkTopology(): boolean {
    if (this.pipeNetworkExternal !== null) {
      return this.pipeNetworkExternal;
    }
    
    // Find all pipe entities
    const pipeEntities = this.blueprint.entities.filter(e => 
      this.isPipeEntity(e.name)
    );
    
    if (pipeEntities.length === 0) {
      // No pipes means fluids go directly between machines - consider internal
      this.pipeNetworkExternal = false;
      return false;
    }
    
    // Count pipe-to-grounds
    const pipeToGrounds = this.blueprint.entities.filter(e => 
      e.name === 'pipe-to-ground'
    );
    
    // A pipe-to-ground is unconnected if there's only 1 total (no pair)
    if (pipeToGrounds.length === 1) {
      this.pipeNetworkExternal = true;
      return true;
    }
    
    // Build a graph of pipe connections
    const pipeGraph = new Map<number, Set<number>>();
    for (const pipe of pipeEntities) {
      pipeGraph.set(pipe.entity_number, new Set());
    }
    
    for (let i = 0; i < pipeEntities.length; i++) {
      for (let j = i + 1; j < pipeEntities.length; j++) {
        const p1 = pipeEntities[i];
        const p2 = pipeEntities[j];
        if (!p1 || !p2) continue;
        
        const dist = distance(p1.position, p2.position);
        
        // Pipes connect if they're within 1.5 tiles
        if (dist <= 1.5) {
          pipeGraph.get(p1.entity_number)!.add(p2.entity_number);
          pipeGraph.get(p2.entity_number)!.add(p1.entity_number);
        }
      }
    }
    
    // Connect pipes to ALL machines (not just specific fluid)
    for (const pipe of pipeEntities) {
      for (const [machineNum, machine] of this.machines) {
        const machineEntity = this.blueprint.entities.find(e => e.entity_number === machineNum);
        if (!machineEntity) continue;
        
        const machineDef = getMachine(machineEntity.name);
        if (!machineDef) continue;
        
        const dist = distance(pipe.position, machine.position);
        const halfDiagonal = Math.sqrt(
          (machineDef.size.width / 2) ** 2 + (machineDef.size.height / 2) ** 2
        );
        const machineRadius = halfDiagonal + 1.5;
        
        if (dist <= machineRadius) {
          pipeGraph.get(pipe.entity_number)!.add(-machineNum);
        }
      }
    }
    
    // Count "dead-end" pipes
    let deadEndCount = 0;
    for (const [pipeNum, connections] of pipeGraph) {
      const hasMachineConnection = Array.from(connections).some(c => c < 0);
      if (!hasMachineConnection && connections.size <= 1) {
        deadEndCount++;
      }
    }
    
    this.pipeNetworkExternal = deadEndCount >= 3;
    return this.pipeNetworkExternal;
  }

  /**
   * Analyzes pipe topology to determine if a fluid has external connections.
   */
  private hasExternalPipeConnections(fluidName: string): boolean {
    // Find all machines that produce or consume this fluid
    const machinesWithFluid = new Set<number>();
    for (const [entityNum, machine] of this.machines) {
      if (!machine.recipe) continue;
      
      for (const ingredient of machine.recipe.ingredients) {
        if (ingredient.type === 'fluid' && ingredient.name === fluidName) {
          machinesWithFluid.add(entityNum);
        }
      }
      
      for (const product of machine.recipe.products) {
        if (product.type === 'fluid' && product.name === fluidName) {
          machinesWithFluid.add(entityNum);
        }
      }
    }
    
    if (machinesWithFluid.size === 0) return false;
    
    // Use the overall pipe network analysis
    return this.analyzePipeNetworkTopology();
  }

  /**
   * Checks if an item is only output to other machines (not to external destinations).
   * This is determined by checking if all output inserters from machines producing this item
   * drop directly into other machines.
   */
  private isOnlyOutputToMachines(itemName: string): boolean {
    // Find all machines that produce this item
    const producers = new Set<number>();
    for (const [entityNum, machine] of this.machines) {
      if (!machine.recipe) continue;
      
      for (const product of machine.recipe.products) {
        if (product.type === 'item' && product.name === itemName) {
          producers.add(entityNum);
        }
      }
    }
    
    if (producers.size === 0) return false;
    
    // Find all inserters
    const inserters = this.blueprint.entities.filter(e => isInserter(e.name));
    
    // For each producer, check if all output inserters go to machines
    for (const producerNum of producers) {
      const producer = this.machines.get(producerNum);
      if (!producer) continue;
      
      const producerEntity = this.blueprint.entities.find(e => e.entity_number === producerNum);
      if (!producerEntity) continue;
      
      // Find inserters that pick from this machine
      const outputInserters = inserters.filter(inserter => {
        const pickupPos = getInserterPickupPosition(inserter);
        const machineDef = getMachine(producerEntity.name);
        return machineDef && isPositionInMachine(pickupPos, producer.position, machineDef.size);
      });
      
      if (outputInserters.length === 0) {
        // No inserters taking from this machine - might be using belts or bots
        // We can't determine, so assume it's external
        return false;
      }
      
      // Check if all output inserters drop into machines
      for (const inserter of outputInserters) {
        const dropPos = getInserterDropPosition(inserter);
        
        // Check if drop position is inside any machine
        let dropsToMachine = false;
        for (const [, machine] of this.machines) {
          const machineEntity = this.blueprint.entities.find(e => e.entity_number === machine.entityNumber);
          if (!machineEntity) continue;
          
          const machineDef = getMachine(machineEntity.name);
          if (machineDef && isPositionInMachine(dropPos, machine.position, machineDef.size)) {
            dropsToMachine = true;
            break;
          }
        }
        
        if (!dropsToMachine) {
          // This inserter drops to something else (chest, belt, etc.)
          return false;
        }
      }
    }
    
    // All output inserters from all producers go to machines
    return true;
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

    // Identify which items are consumed internally by any machine
    const internallyConsumedItems = this.getInternallyConsumedItems();

    for (const [item, flow] of this.itemFlows) {
      // Apply utilization to flows
      const adjustedConsumed = flow.consumed;
      const adjustedProduced = flow.produced;
      const netFlow = adjustedProduced - adjustedConsumed;

      // Determine if this is a fluid or item
      let isFluid = false;
      for (const [, machine] of this.machines) {
        if (!machine.recipe) continue;
        
        for (const ingredient of machine.recipe.ingredients) {
          if (ingredient.name === item && ingredient.type === 'fluid') {
            isFluid = true;
            break;
          }
        }
        
        for (const product of machine.recipe.products) {
          if (product.name === item && product.type === 'fluid') {
            isFluid = true;
            break;
          }
        }
        
        if (isFluid) break;
      }

      // Only report flows that exceed the threshold to avoid floating-point noise
      if (netFlow < -EXTERNAL_FLOW_THRESHOLD) {
        // Net consumption - this is an external input
        inputs.set(item, -netFlow);
      } else if (netFlow > EXTERNAL_FLOW_THRESHOLD) {
        // Net production - check if it's truly external
        
        // Skip if consumed internally
        if (internallyConsumedItems.has(item)) {
          continue;
        }
        
        // For fluids, check pipe topology
        if (isFluid) {
          if (this.hasExternalPipeConnections(item)) {
            outputs.set(item, netFlow);
          }
          // If no external pipe connections, it's internal piping - don't report
        } else {
          // For items, check if only output to machines
          if (!this.isOnlyOutputToMachines(item)) {
            outputs.set(item, netFlow);
          }
          // If only output to machines, it's an intermediate - don't report
        }
      }
      // Items with |netFlow| <= threshold are considered balanced and not reported
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

  /**
   * Checks for machines that appear to be missing necessary inputs.
   * This happens when a machine has significant supply-limited bottlenecks.
   */
  private checkForMissingInputProblems(): void {
    // Check each machine for supply-based bottlenecks
    for (const [, machine] of this.machines) {
      if (!machine.recipe) continue;
      
      // If a machine is bottlenecked by a shortage and the item has no internal production,
      // it means the input is completely missing from the blueprint
      if (machine.bottleneckedBy && machine.bottleneckedBy.includes("shortage")) {
        // Extract the item name from the bottleneck message
        const shortageMatch = machine.bottleneckedBy.match(/^(.+) shortage$/);
        if (shortageMatch && shortageMatch[1]) {
          const itemName = shortageMatch[1];
          
          // Check if this item is produced at all in the blueprint
          const flow = this.itemFlows.get(
            // Try to convert display name back to internal name
            itemName.toLowerCase().replace(/ /g, "-")
          );
          
          // If there's no production of this item, report as missing input
          if (!flow || flow.produced === 0) {
            // Check if we already have this problem reported
            const alreadyReported = this.problems.some(
              p => p.type === "missing-input" && 
                   p.machineName === machine.machineName &&
                   p.itemName === itemName
            );
            
            if (!alreadyReported) {
              this.problems.push({
                type: "missing-input",
                message: `${machine.machineName} may be missing input: ${itemName}`,
                entityNumber: machine.entityNumber,
                machineName: machine.machineName,
                recipeName: machine.recipe.name,
                itemName,
              });
            }
          }
        }
      }
    }
  }
}

/**
 * Figure space (U+2007) has the same width as a digit in variable-width fonts
 */
const FIGURE_SPACE = "\u2007";

/**
 * Formats a rate value with left-padding using figure spaces to align decimal points.
 * @param rate The rate value to format
 * @param maxIntegerDigits The maximum number of integer digits for alignment
 * @returns Formatted string like "  22.3/s" with figure space padding
 */
function formatRate(rate: number, maxIntegerDigits: number): string {
  const formatted = rate.toFixed(1);
  const [intPart] = formatted.split(".");
  const padLength = Math.max(0, maxIntegerDigits - (intPart?.length ?? 0));
  const padding = FIGURE_SPACE.repeat(padLength);
  return `${padding}${formatted}/s`;
}

/**
 * Calculates the maximum number of integer digits across all rates
 */
function getMaxIntegerDigits(rates: Map<string, number>): number {
  let maxDigits = 1;
  for (const rate of rates.values()) {
    const intPart = Math.floor(rate).toString();
    maxDigits = Math.max(maxDigits, intPart.length);
  }
  return maxDigits;
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
  lines.push("Inputs");
  if (result.externalInputs.size > 0) {
    const maxDigits = getMaxIntegerDigits(result.externalInputs);
    for (const [item, rate] of result.externalInputs) {
      lines.push(`${formatRate(rate, maxDigits)} ${getDisplayName(item)}`);
    }
  } else {
    lines.push("  None");
  }

  lines.push("");

  // Format outputs
  lines.push("Outputs");
  if (result.externalOutputs.size > 0) {
    const maxDigits = getMaxIntegerDigits(result.externalOutputs);
    for (const [item, rate] of result.externalOutputs) {
      lines.push(`${formatRate(rate, maxDigits)} ${getDisplayName(item)}`);
    }
  } else {
    lines.push("  None");
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

  // Format problems if any
  if (result.problems.length > 0) {
    lines.push("");
    lines.push("Problems:");
    for (const problem of result.problems) {
      lines.push(`  ⚠ ${problem.message}`);
    }
  }

  lines.push("—");

  return lines.join("\n");
}
