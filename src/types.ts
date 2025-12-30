/**
 * Factorio Blueprint Analyzer Types
 */

// Blueprint format types
export interface BlueprintString {
  blueprint?: Blueprint;
  blueprint_book?: BlueprintBook;
}

export interface BlueprintBook {
  blueprints: Array<{ blueprint: Blueprint; index: number }>;
  item: "blueprint-book";
  label?: string;
  active_index?: number;
  version: number;
}

export interface Blueprint {
  icons?: BlueprintIcon[];
  entities: BlueprintEntity[];
  tiles?: BlueprintTile[];
  wires?: number[][];
  item: "blueprint";
  label?: string;
  version: number;
}

export interface BlueprintIcon {
  signal: { name: string; type?: string };
  index: number;
}

export interface BlueprintEntity {
  entity_number: number;
  name: string;
  position: Position;
  direction?: number;
  mirror?: boolean;
  recipe?: string;
  recipe_quality?: string;
  items?: BlueprintModuleEntry[];
  neighbours?: number[];
  connections?: Record<string, unknown>;
  filters?: InserterFilter[];
  use_filters?: boolean;
}

export interface InserterFilter {
  index: number;
  name: string;
  quality?: string;
  comparator?: string;
}

export interface BlueprintModuleEntry {
  id: { name: string; quality?: string };
  items: {
    in_inventory: Array<{ inventory: number; stack: number }>;
  };
}

export interface BlueprintTile {
  name: string;
  position: Position;
}

export interface Position {
  x: number;
  y: number;
}

// Game data types
export interface Recipe {
  name: string;
  internalName: string;
  craftingTime: number;
  ingredients: Ingredient[];
  products: Product[];
  category: RecipeCategory;
  allowProductivity: boolean;
}

export interface Ingredient {
  name: string;
  amount: number;
  type: "item" | "fluid";
}

export interface Product {
  name: string;
  amount: number;
  type: "item" | "fluid";
  probability?: number;
}

export type RecipeCategory =
  | "crafting"
  | "crafting-with-fluid"
  | "advanced-crafting"
  | "smelting"
  | "metallurgy"
  | "pressing"
  | "chemistry"
  | "oil-processing"
  | "centrifuging"
  | "electromagnetics"
  | "cryogenics"
  | "organic"
  | "organic-or-assembling"
  | "crushing";

export interface Machine {
  name: string;
  internalName: string;
  craftingSpeed: number;
  moduleSlots: number;
  allowedCategories: RecipeCategory[];
  allowedEffects: ModuleEffect[];
  baseProductivity: number;
  size: { width: number; height: number };
}

export type ModuleEffect =
  | "speed"
  | "productivity"
  | "consumption"
  | "pollution"
  | "quality";

export interface Module {
  name: string;
  internalName: string;
  effects: {
    speed?: number;
    productivity?: number;
    consumption?: number;
    pollution?: number;
    quality?: number;
  };
  tier: number;
}

export interface Beacon {
  name: string;
  internalName: string;
  moduleSlots: number;
  transmissionEfficiency: number;
  range: number;
  size: { width: number; height: number };
  profileMultiplier: number[];
}

// Analysis types
export interface AnalyzedMachine {
  entityNumber: number;
  machineName: string;
  machineType: string;
  recipe: Recipe | null;
  position: Position;
  modules: Module[];
  affectingBeacons: AnalyzedBeacon[];
  effectiveSpeed: number;
  effectiveProductivity: number;
  inputRates: Map<string, number>;
  outputRates: Map<string, number>;
  utilization: number;
  bottleneckedBy: string | null;
}

export interface AnalyzedBeacon {
  entityNumber: number;
  position: Position;
  modules: Module[];
  transmissionFactor: number;
}

export interface ItemFlow {
  name: string;
  type: "item" | "fluid";
  rate: number;
  isExternal: boolean;
  sources: number[];
  sinks: number[];
}

export interface AnalysisResult {
  filename: string;
  blueprintName?: string;
  externalInputs: Map<string, number>;
  externalOutputs: Map<string, number>;
  machines: AnalyzedMachine[];
  utilization: Map<string, { count: number; avgUtilization: number }>;
}
