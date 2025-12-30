/**
 * Factorio Space Age (2.0) Game Data
 * Contains machines, recipes, modules, and beacons data
 */

import type {
  Machine,
  Module,
  Recipe,
  Beacon,
  RecipeCategory,
} from "./types.js";

// Machine definitions
export const MACHINES: Map<string, Machine> = new Map([
  [
    "assembling-machine-1",
    {
      name: "Assembling Machine 1",
      internalName: "assembling-machine-1",
      craftingSpeed: 0.5,
      moduleSlots: 0,
      allowedCategories: ["crafting", "advanced-crafting", "crafting-with-fluid"],
      allowedEffects: [],
      baseProductivity: 0,
      size: { width: 3, height: 3 },
    },
  ],
  [
    "assembling-machine-2",
    {
      name: "Assembling Machine 2",
      internalName: "assembling-machine-2",
      craftingSpeed: 0.75,
      moduleSlots: 2,
      allowedCategories: ["crafting", "advanced-crafting", "crafting-with-fluid"],
      allowedEffects: ["speed", "productivity", "consumption", "pollution", "quality"],
      baseProductivity: 0,
      size: { width: 3, height: 3 },
    },
  ],
  [
    "assembling-machine-3",
    {
      name: "Assembling Machine 3",
      internalName: "assembling-machine-3",
      craftingSpeed: 1.25,
      moduleSlots: 4,
      allowedCategories: ["crafting", "advanced-crafting", "crafting-with-fluid"],
      allowedEffects: ["speed", "productivity", "consumption", "pollution", "quality"],
      baseProductivity: 0,
      size: { width: 3, height: 3 },
    },
  ],
  [
    "foundry",
    {
      name: "Foundry",
      internalName: "foundry",
      craftingSpeed: 4.0,
      moduleSlots: 4,
      allowedCategories: ["metallurgy", "pressing", "crafting-with-fluid", "smelting"],
      allowedEffects: ["speed", "productivity", "consumption", "pollution", "quality"],
      baseProductivity: 0.5,
      size: { width: 4, height: 4 },
    },
  ],
  [
    "electric-furnace",
    {
      name: "Electric Furnace",
      internalName: "electric-furnace",
      craftingSpeed: 2.0,
      moduleSlots: 2,
      allowedCategories: ["smelting"],
      allowedEffects: ["speed", "productivity", "consumption", "pollution", "quality"],
      baseProductivity: 0,
      size: { width: 3, height: 3 },
    },
  ],
  [
    "chemical-plant",
    {
      name: "Chemical Plant",
      internalName: "chemical-plant",
      craftingSpeed: 1.0,
      moduleSlots: 3,
      allowedCategories: ["chemistry", "oil-processing"],
      allowedEffects: ["speed", "productivity", "consumption", "pollution", "quality"],
      baseProductivity: 0,
      size: { width: 3, height: 3 },
    },
  ],
  [
    "oil-refinery",
    {
      name: "Oil Refinery",
      internalName: "oil-refinery",
      craftingSpeed: 1.0,
      moduleSlots: 3,
      allowedCategories: ["oil-processing"],
      allowedEffects: ["speed", "productivity", "consumption", "pollution", "quality"],
      baseProductivity: 0,
      size: { width: 5, height: 5 },
    },
  ],
  [
    "centrifuge",
    {
      name: "Centrifuge",
      internalName: "centrifuge",
      craftingSpeed: 1.0,
      moduleSlots: 2,
      allowedCategories: ["centrifuging"],
      allowedEffects: ["speed", "productivity", "consumption", "pollution", "quality"],
      baseProductivity: 0,
      size: { width: 3, height: 3 },
    },
  ],
  [
    "electromagnetic-plant",
    {
      name: "Electromagnetic Plant",
      internalName: "electromagnetic-plant",
      craftingSpeed: 2.0,
      moduleSlots: 5,
      allowedCategories: ["electromagnetics", "crafting", "crafting-with-fluid"],
      allowedEffects: ["speed", "productivity", "consumption", "pollution", "quality"],
      baseProductivity: 0.5,
      size: { width: 4, height: 4 },
    },
  ],
  [
    "cryogenic-plant",
    {
      name: "Cryogenic Plant",
      internalName: "cryogenic-plant",
      craftingSpeed: 2.0,
      moduleSlots: 8,
      allowedCategories: ["cryogenics", "chemistry"],
      allowedEffects: ["speed", "productivity", "consumption", "pollution", "quality"],
      baseProductivity: 0,
      size: { width: 5, height: 5 },
    },
  ],
  [
    "biochamber",
    {
      name: "Biochamber",
      internalName: "biochamber",
      craftingSpeed: 2.0,
      moduleSlots: 4,
      allowedCategories: ["organic", "organic-or-assembling"],
      allowedEffects: ["speed", "productivity", "consumption", "pollution", "quality"],
      baseProductivity: 0.5,
      size: { width: 4, height: 4 },
    },
  ],
  [
    "crusher",
    {
      name: "Crusher",
      internalName: "crusher",
      craftingSpeed: 2.0,
      moduleSlots: 4,
      allowedCategories: ["crushing"],
      allowedEffects: ["speed", "productivity", "consumption", "pollution", "quality"],
      baseProductivity: 0.5,
      size: { width: 5, height: 5 },
    },
  ],
]);

// Module definitions
export const MODULES: Map<string, Module> = new Map([
  // Speed modules
  [
    "speed-module",
    {
      name: "Speed Module",
      internalName: "speed-module",
      effects: { speed: 0.2, consumption: 0.5 },
      tier: 1,
    },
  ],
  [
    "speed-module-2",
    {
      name: "Speed Module 2",
      internalName: "speed-module-2",
      effects: { speed: 0.3, consumption: 0.6 },
      tier: 2,
    },
  ],
  [
    "speed-module-3",
    {
      name: "Speed Module 3",
      internalName: "speed-module-3",
      effects: { speed: 0.5, consumption: 0.7 },
      tier: 3,
    },
  ],
  // Productivity modules
  [
    "productivity-module",
    {
      name: "Productivity Module",
      internalName: "productivity-module",
      effects: { productivity: 0.04, speed: -0.05, consumption: 0.4, pollution: 0.05 },
      tier: 1,
    },
  ],
  [
    "productivity-module-2",
    {
      name: "Productivity Module 2",
      internalName: "productivity-module-2",
      effects: { productivity: 0.06, speed: -0.1, consumption: 0.6, pollution: 0.075 },
      tier: 2,
    },
  ],
  [
    "productivity-module-3",
    {
      name: "Productivity Module 3",
      internalName: "productivity-module-3",
      effects: { productivity: 0.1, speed: -0.15, consumption: 0.8, pollution: 0.1 },
      tier: 3,
    },
  ],
  // Efficiency modules
  [
    "efficiency-module",
    {
      name: "Efficiency Module",
      internalName: "efficiency-module",
      effects: { consumption: -0.3 },
      tier: 1,
    },
  ],
  [
    "efficiency-module-2",
    {
      name: "Efficiency Module 2",
      internalName: "efficiency-module-2",
      effects: { consumption: -0.4 },
      tier: 2,
    },
  ],
  [
    "efficiency-module-3",
    {
      name: "Efficiency Module 3",
      internalName: "efficiency-module-3",
      effects: { consumption: -0.5 },
      tier: 3,
    },
  ],
  // Quality modules (Space Age)
  [
    "quality-module",
    {
      name: "Quality Module",
      internalName: "quality-module",
      effects: { quality: 0.01, speed: -0.05 },
      tier: 1,
    },
  ],
  [
    "quality-module-2",
    {
      name: "Quality Module 2",
      internalName: "quality-module-2",
      effects: { quality: 0.02, speed: -0.05 },
      tier: 2,
    },
  ],
  [
    "quality-module-3",
    {
      name: "Quality Module 3",
      internalName: "quality-module-3",
      effects: { quality: 0.025, speed: -0.05 },
      tier: 3,
    },
  ],
]);

// Beacon definitions
export const BEACONS: Map<string, Beacon> = new Map([
  [
    "beacon",
    {
      name: "Beacon",
      internalName: "beacon",
      moduleSlots: 2,
      transmissionEfficiency: 1.5, // 150% base transmission efficiency
      range: 3, // 3 tiles from edge
      size: { width: 3, height: 3 },
      // Profile multiplier for diminishing returns (not currently used)
      profileMultiplier: [1.0, 0.7071, 0.5774, 0.5, 0.4472, 0.4082, 0.378, 0.3536, 0.3333, 0.3162],
    },
  ],
]);

// Recipe definitions - Space Age recipes
export const RECIPES: Map<string, Recipe> = new Map([
  // Basic recipes
  [
    "iron-plate",
    {
      name: "Iron Plate",
      internalName: "iron-plate",
      craftingTime: 3.2,
      ingredients: [{ name: "iron-ore", amount: 1, type: "item" }],
      products: [{ name: "iron-plate", amount: 1, type: "item" }],
      category: "smelting",
      allowProductivity: true,
    },
  ],
  [
    "copper-plate",
    {
      name: "Copper Plate",
      internalName: "copper-plate",
      craftingTime: 3.2,
      ingredients: [{ name: "copper-ore", amount: 1, type: "item" }],
      products: [{ name: "copper-plate", amount: 1, type: "item" }],
      category: "smelting",
      allowProductivity: true,
    },
  ],
  [
    "iron-gear-wheel",
    {
      name: "Iron Gear Wheel",
      internalName: "iron-gear-wheel",
      craftingTime: 0.5,
      ingredients: [{ name: "iron-plate", amount: 2, type: "item" }],
      products: [{ name: "iron-gear-wheel", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "automation-science-pack",
    {
      name: "Automation Science Pack",
      internalName: "automation-science-pack",
      craftingTime: 5,
      ingredients: [
        { name: "copper-plate", amount: 1, type: "item" },
        { name: "iron-gear-wheel", amount: 1, type: "item" },
      ],
      products: [{ name: "automation-science-pack", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  // Foundry recipes (Space Age)
  [
    "molten-iron",
    {
      name: "Molten Iron",
      internalName: "molten-iron",
      craftingTime: 32,
      ingredients: [
        { name: "iron-ore", amount: 50, type: "item" },
        { name: "calcite", amount: 1, type: "item" },
      ],
      products: [{ name: "molten-iron", amount: 500, type: "fluid" }],
      category: "metallurgy",
      allowProductivity: true,
    },
  ],
  [
    "molten-copper",
    {
      name: "Molten Copper",
      internalName: "molten-copper",
      craftingTime: 32,
      ingredients: [
        { name: "copper-ore", amount: 50, type: "item" },
        { name: "calcite", amount: 1, type: "item" },
      ],
      products: [{ name: "molten-copper", amount: 500, type: "fluid" }],
      category: "metallurgy",
      allowProductivity: true,
    },
  ],
  [
    "casting-iron",
    {
      name: "Casting Iron",
      internalName: "casting-iron",
      craftingTime: 3.2,
      ingredients: [{ name: "molten-iron", amount: 20, type: "fluid" }],
      products: [{ name: "iron-plate", amount: 2, type: "item" }],
      category: "metallurgy",
      allowProductivity: true,
    },
  ],
  [
    "casting-copper",
    {
      name: "Casting Copper",
      internalName: "casting-copper",
      craftingTime: 3.2,
      ingredients: [{ name: "molten-copper", amount: 20, type: "fluid" }],
      products: [{ name: "copper-plate", amount: 2, type: "item" }],
      category: "metallurgy",
      allowProductivity: true,
    },
  ],
  [
    "casting-iron-gear-wheel",
    {
      name: "Casting Iron Gear Wheel",
      internalName: "casting-iron-gear-wheel",
      craftingTime: 1,
      ingredients: [{ name: "molten-iron", amount: 10, type: "fluid" }],
      products: [{ name: "iron-gear-wheel", amount: 1, type: "item" }],
      category: "metallurgy",
      allowProductivity: true,
    },
  ],
  [
    "casting-steel",
    {
      name: "Casting Steel",
      internalName: "casting-steel",
      craftingTime: 3.2,
      ingredients: [{ name: "molten-iron", amount: 30, type: "fluid" }],
      products: [{ name: "steel-plate", amount: 1, type: "item" }],
      category: "metallurgy",
      allowProductivity: true,
    },
  ],
  [
    "casting-iron-stick",
    {
      name: "Casting Iron Stick",
      internalName: "casting-iron-stick",
      craftingTime: 1,
      ingredients: [{ name: "molten-iron", amount: 20, type: "fluid" }],
      products: [{ name: "iron-stick", amount: 4, type: "item" }],
      category: "metallurgy",
      allowProductivity: true,
    },
  ],
  [
    "casting-pipe",
    {
      name: "Casting Pipe",
      internalName: "casting-pipe",
      craftingTime: 1,
      ingredients: [{ name: "molten-iron", amount: 10, type: "fluid" }],
      products: [{ name: "pipe", amount: 1, type: "item" }],
      category: "metallurgy",
      allowProductivity: true,
    },
  ],
  [
    "casting-copper-cable",
    {
      name: "Casting Copper Cable",
      internalName: "casting-copper-cable",
      craftingTime: 1,
      ingredients: [{ name: "molten-copper", amount: 5, type: "fluid" }],
      products: [{ name: "copper-cable", amount: 2, type: "item" }],
      category: "metallurgy",
      allowProductivity: true,
    },
  ],
  // More basic recipes
  [
    "copper-cable",
    {
      name: "Copper Cable",
      internalName: "copper-cable",
      craftingTime: 0.5,
      ingredients: [{ name: "copper-plate", amount: 1, type: "item" }],
      products: [{ name: "copper-cable", amount: 2, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "electronic-circuit",
    {
      name: "Electronic Circuit",
      internalName: "electronic-circuit",
      craftingTime: 0.5,
      ingredients: [
        { name: "copper-cable", amount: 3, type: "item" },
        { name: "iron-plate", amount: 1, type: "item" },
      ],
      products: [{ name: "electronic-circuit", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "logistic-science-pack",
    {
      name: "Logistic Science Pack",
      internalName: "logistic-science-pack",
      craftingTime: 6,
      ingredients: [
        { name: "inserter", amount: 1, type: "item" },
        { name: "transport-belt", amount: 1, type: "item" },
      ],
      products: [{ name: "logistic-science-pack", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "transport-belt",
    {
      name: "Transport Belt",
      internalName: "transport-belt",
      craftingTime: 0.5,
      ingredients: [
        { name: "iron-gear-wheel", amount: 1, type: "item" },
        { name: "iron-plate", amount: 1, type: "item" },
      ],
      products: [{ name: "transport-belt", amount: 2, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "inserter",
    {
      name: "Inserter",
      internalName: "inserter",
      craftingTime: 0.5,
      ingredients: [
        { name: "electronic-circuit", amount: 1, type: "item" },
        { name: "iron-gear-wheel", amount: 1, type: "item" },
        { name: "iron-plate", amount: 1, type: "item" },
      ],
      products: [{ name: "inserter", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "steel-plate",
    {
      name: "Steel Plate",
      internalName: "steel-plate",
      craftingTime: 16,
      ingredients: [{ name: "iron-plate", amount: 5, type: "item" }],
      products: [{ name: "steel-plate", amount: 1, type: "item" }],
      category: "smelting",
      allowProductivity: true,
    },
  ],
  [
    "iron-stick",
    {
      name: "Iron Stick",
      internalName: "iron-stick",
      craftingTime: 0.5,
      ingredients: [{ name: "iron-plate", amount: 1, type: "item" }],
      products: [{ name: "iron-stick", amount: 2, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "pipe",
    {
      name: "Pipe",
      internalName: "pipe",
      craftingTime: 0.5,
      ingredients: [{ name: "iron-plate", amount: 1, type: "item" }],
      products: [{ name: "pipe", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  // Engine recipes
  [
    "engine-unit",
    {
      name: "Engine Unit",
      internalName: "engine-unit",
      craftingTime: 10,
      ingredients: [
        { name: "steel-plate", amount: 1, type: "item" },
        { name: "iron-gear-wheel", amount: 1, type: "item" },
        { name: "pipe", amount: 2, type: "item" },
      ],
      products: [{ name: "engine-unit", amount: 1, type: "item" }],
      category: "advanced-crafting",
      allowProductivity: true,
    },
  ],
  [
    "electric-engine-unit",
    {
      name: "Electric Engine Unit",
      internalName: "electric-engine-unit",
      craftingTime: 10,
      ingredients: [
        { name: "electronic-circuit", amount: 2, type: "item" },
        { name: "engine-unit", amount: 1, type: "item" },
        { name: "lubricant", amount: 15, type: "fluid" },
      ],
      products: [{ name: "electric-engine-unit", amount: 1, type: "item" }],
      category: "crafting-with-fluid",
      allowProductivity: true,
    },
  ],
  // Battery recipe
  [
    "battery",
    {
      name: "Battery",
      internalName: "battery",
      craftingTime: 4,
      ingredients: [
        { name: "sulfuric-acid", amount: 20, type: "fluid" },
        { name: "iron-plate", amount: 1, type: "item" },
        { name: "copper-plate", amount: 1, type: "item" },
      ],
      products: [{ name: "battery", amount: 1, type: "item" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  // Flying robot frame
  [
    "flying-robot-frame",
    {
      name: "Flying Robot Frame",
      internalName: "flying-robot-frame",
      craftingTime: 20,
      ingredients: [
        { name: "electric-engine-unit", amount: 1, type: "item" },
        { name: "battery", amount: 2, type: "item" },
        { name: "electronic-circuit", amount: 3, type: "item" },
        { name: "steel-plate", amount: 1, type: "item" },
      ],
      products: [{ name: "flying-robot-frame", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
]);

/**
 * Gets a machine definition by internal name
 */
export function getMachine(name: string): Machine | undefined {
  return MACHINES.get(name);
}

/**
 * Gets a module definition by internal name
 */
export function getModule(name: string): Module | undefined {
  return MODULES.get(name);
}

/**
 * Gets a recipe definition by internal name
 */
export function getRecipe(name: string): Recipe | undefined {
  return RECIPES.get(name);
}

/**
 * Gets a beacon definition by internal name
 */
export function getBeacon(name: string): Beacon | undefined {
  return BEACONS.get(name);
}

/**
 * Checks if an entity is a production machine
 */
export function isProductionMachine(entityName: string): boolean {
  return MACHINES.has(entityName);
}

/**
 * Checks if an entity is a beacon
 */
export function isBeacon(entityName: string): boolean {
  return BEACONS.has(entityName);
}

/**
 * Checks if an entity is a transport entity (belt, inserter, etc.)
 */
export function isTransportEntity(entityName: string): boolean {
  const transportEntities = [
    "transport-belt",
    "fast-transport-belt",
    "express-transport-belt",
    "turbo-transport-belt",
    "underground-belt",
    "fast-underground-belt",
    "express-underground-belt",
    "turbo-underground-belt",
    "splitter",
    "fast-splitter",
    "express-splitter",
    "turbo-splitter",
    "inserter",
    "long-handed-inserter",
    "fast-inserter",
    "bulk-inserter",
    "stack-inserter",
    "burner-inserter",
  ];
  return transportEntities.includes(entityName);
}

/**
 * Checks if an entity is a storage entity (chest, wagon, etc.)
 */
export function isStorageEntity(entityName: string): boolean {
  const storageEntities = [
    "wooden-chest",
    "iron-chest",
    "steel-chest",
    "logistic-chest-passive-provider",
    "logistic-chest-active-provider",
    "logistic-chest-storage",
    "logistic-chest-buffer",
    "logistic-chest-requester",
    "cargo-wagon",
    "fluid-wagon",
  ];
  return storageEntities.includes(entityName);
}

/**
 * Checks if an entity is a rail entity (for cargo wagon detection)
 */
export function isRailEntity(entityName: string): boolean {
  return entityName.includes("rail") || entityName === "train-stop";
}

/**
 * Get display name for item/fluid
 */
export function getDisplayName(internalName: string): string {
  return internalName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
