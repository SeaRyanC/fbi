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
  [
    "casting-low-density-structure",
    {
      name: "Casting Low Density Structure",
      internalName: "casting-low-density-structure",
      craftingTime: 20,
      ingredients: [
        { name: "molten-iron", amount: 60, type: "fluid" },
        { name: "molten-copper", amount: 200, type: "fluid" },
        { name: "plastic-bar", amount: 5, type: "item" },
      ],
      products: [{ name: "low-density-structure", amount: 1, type: "item" }],
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
  // Advanced circuits
  [
    "advanced-circuit",
    {
      name: "Advanced Circuit",
      internalName: "advanced-circuit",
      craftingTime: 6,
      ingredients: [
        { name: "electronic-circuit", amount: 2, type: "item" },
        { name: "plastic-bar", amount: 2, type: "item" },
        { name: "copper-cable", amount: 4, type: "item" },
      ],
      products: [{ name: "advanced-circuit", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "processing-unit",
    {
      name: "Processing Unit",
      internalName: "processing-unit",
      craftingTime: 10,
      ingredients: [
        { name: "electronic-circuit", amount: 20, type: "item" },
        { name: "advanced-circuit", amount: 2, type: "item" },
        { name: "sulfuric-acid", amount: 5, type: "fluid" },
      ],
      products: [{ name: "processing-unit", amount: 1, type: "item" }],
      category: "crafting-with-fluid",
      allowProductivity: true,
    },
  ],
  // Plastics and chemicals
  [
    "plastic-bar",
    {
      name: "Plastic Bar",
      internalName: "plastic-bar",
      craftingTime: 1,
      ingredients: [
        { name: "petroleum-gas", amount: 20, type: "fluid" },
        { name: "coal", amount: 1, type: "item" },
      ],
      products: [{ name: "plastic-bar", amount: 2, type: "item" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  [
    "sulfur",
    {
      name: "Sulfur",
      internalName: "sulfur",
      craftingTime: 1,
      ingredients: [
        { name: "water", amount: 30, type: "fluid" },
        { name: "petroleum-gas", amount: 30, type: "fluid" },
      ],
      products: [{ name: "sulfur", amount: 2, type: "item" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  [
    "sulfuric-acid",
    {
      name: "Sulfuric Acid",
      internalName: "sulfuric-acid",
      craftingTime: 1,
      ingredients: [
        { name: "sulfur", amount: 5, type: "item" },
        { name: "iron-plate", amount: 1, type: "item" },
        { name: "water", amount: 100, type: "fluid" },
      ],
      products: [{ name: "sulfuric-acid", amount: 50, type: "fluid" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  [
    "lubricant",
    {
      name: "Lubricant",
      internalName: "lubricant",
      craftingTime: 1,
      ingredients: [{ name: "heavy-oil", amount: 10, type: "fluid" }],
      products: [{ name: "lubricant", amount: 10, type: "fluid" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  // Oil processing
  [
    "basic-oil-processing",
    {
      name: "Basic Oil Processing",
      internalName: "basic-oil-processing",
      craftingTime: 5,
      ingredients: [{ name: "crude-oil", amount: 100, type: "fluid" }],
      products: [{ name: "petroleum-gas", amount: 45, type: "fluid" }],
      category: "oil-processing",
      allowProductivity: true,
    },
  ],
  [
    "advanced-oil-processing",
    {
      name: "Advanced Oil Processing",
      internalName: "advanced-oil-processing",
      craftingTime: 5,
      ingredients: [
        { name: "crude-oil", amount: 100, type: "fluid" },
        { name: "water", amount: 50, type: "fluid" },
      ],
      products: [
        { name: "heavy-oil", amount: 25, type: "fluid" },
        { name: "light-oil", amount: 45, type: "fluid" },
        { name: "petroleum-gas", amount: 55, type: "fluid" },
      ],
      category: "oil-processing",
      allowProductivity: true,
    },
  ],
  [
    "heavy-oil-cracking",
    {
      name: "Heavy Oil Cracking",
      internalName: "heavy-oil-cracking",
      craftingTime: 2,
      ingredients: [
        { name: "heavy-oil", amount: 40, type: "fluid" },
        { name: "water", amount: 30, type: "fluid" },
      ],
      products: [{ name: "light-oil", amount: 30, type: "fluid" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  [
    "light-oil-cracking",
    {
      name: "Light Oil Cracking",
      internalName: "light-oil-cracking",
      craftingTime: 2,
      ingredients: [
        { name: "light-oil", amount: 30, type: "fluid" },
        { name: "water", amount: 30, type: "fluid" },
      ],
      products: [{ name: "petroleum-gas", amount: 20, type: "fluid" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  [
    "solid-fuel-from-light-oil",
    {
      name: "Solid Fuel from Light Oil",
      internalName: "solid-fuel-from-light-oil",
      craftingTime: 2,
      ingredients: [{ name: "light-oil", amount: 10, type: "fluid" }],
      products: [{ name: "solid-fuel", amount: 1, type: "item" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  [
    "solid-fuel-from-petroleum-gas",
    {
      name: "Solid Fuel from Petroleum Gas",
      internalName: "solid-fuel-from-petroleum-gas",
      craftingTime: 2,
      ingredients: [{ name: "petroleum-gas", amount: 20, type: "fluid" }],
      products: [{ name: "solid-fuel", amount: 1, type: "item" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  [
    "solid-fuel-from-heavy-oil",
    {
      name: "Solid Fuel from Heavy Oil",
      internalName: "solid-fuel-from-heavy-oil",
      craftingTime: 2,
      ingredients: [{ name: "heavy-oil", amount: 20, type: "fluid" }],
      products: [{ name: "solid-fuel", amount: 1, type: "item" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  [
    "rocket-fuel",
    {
      name: "Rocket Fuel",
      internalName: "rocket-fuel",
      craftingTime: 30,
      ingredients: [
        { name: "solid-fuel", amount: 10, type: "item" },
        { name: "light-oil", amount: 10, type: "fluid" },
      ],
      products: [{ name: "rocket-fuel", amount: 1, type: "item" }],
      category: "crafting-with-fluid",
      allowProductivity: true,
    },
  ],
  // Science packs
  [
    "military-science-pack",
    {
      name: "Military Science Pack",
      internalName: "military-science-pack",
      craftingTime: 10,
      ingredients: [
        { name: "piercing-rounds-magazine", amount: 1, type: "item" },
        { name: "grenade", amount: 1, type: "item" },
        { name: "stone-wall", amount: 2, type: "item" },
      ],
      products: [{ name: "military-science-pack", amount: 2, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "chemical-science-pack",
    {
      name: "Chemical Science Pack",
      internalName: "chemical-science-pack",
      craftingTime: 24,
      ingredients: [
        { name: "engine-unit", amount: 2, type: "item" },
        { name: "advanced-circuit", amount: 3, type: "item" },
        { name: "sulfur", amount: 1, type: "item" },
      ],
      products: [{ name: "chemical-science-pack", amount: 2, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "production-science-pack",
    {
      name: "Production Science Pack",
      internalName: "production-science-pack",
      craftingTime: 21,
      ingredients: [
        { name: "electric-furnace", amount: 1, type: "item" },
        { name: "productivity-module", amount: 1, type: "item" },
        { name: "rail", amount: 30, type: "item" },
      ],
      products: [{ name: "production-science-pack", amount: 3, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "utility-science-pack",
    {
      name: "Utility Science Pack",
      internalName: "utility-science-pack",
      craftingTime: 21,
      ingredients: [
        { name: "low-density-structure", amount: 3, type: "item" },
        { name: "processing-unit", amount: 2, type: "item" },
        { name: "flying-robot-frame", amount: 1, type: "item" },
      ],
      products: [{ name: "utility-science-pack", amount: 3, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "electromagnetic-science-pack",
    {
      name: "Electromagnetic Science Pack",
      internalName: "electromagnetic-science-pack",
      craftingTime: 10,
      ingredients: [
        { name: "accumulator", amount: 1, type: "item" },
        { name: "supercapacitor", amount: 1, type: "item" },
        { name: "holmium-plate", amount: 2, type: "item" },
      ],
      products: [{ name: "electromagnetic-science-pack", amount: 1, type: "item" }],
      category: "electromagnetics",
      allowProductivity: true,
    },
  ],
  // Robots
  [
    "logistic-robot",
    {
      name: "Logistic Robot",
      internalName: "logistic-robot",
      craftingTime: 0.5,
      ingredients: [
        { name: "flying-robot-frame", amount: 1, type: "item" },
        { name: "advanced-circuit", amount: 2, type: "item" },
      ],
      products: [{ name: "logistic-robot", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "construction-robot",
    {
      name: "Construction Robot",
      internalName: "construction-robot",
      craftingTime: 0.5,
      ingredients: [
        { name: "flying-robot-frame", amount: 1, type: "item" },
        { name: "electronic-circuit", amount: 2, type: "item" },
      ],
      products: [{ name: "construction-robot", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  // Rocket parts
  [
    "low-density-structure",
    {
      name: "Low Density Structure",
      internalName: "low-density-structure",
      craftingTime: 20,
      ingredients: [
        { name: "steel-plate", amount: 2, type: "item" },
        { name: "copper-plate", amount: 20, type: "item" },
        { name: "plastic-bar", amount: 5, type: "item" },
      ],
      products: [{ name: "low-density-structure", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "rocket-control-unit",
    {
      name: "Rocket Control Unit",
      internalName: "rocket-control-unit",
      craftingTime: 30,
      ingredients: [
        { name: "processing-unit", amount: 1, type: "item" },
        { name: "speed-module", amount: 1, type: "item" },
      ],
      products: [{ name: "rocket-control-unit", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "rocket-part",
    {
      name: "Rocket Part",
      internalName: "rocket-part",
      craftingTime: 3,
      ingredients: [
        { name: "rocket-control-unit", amount: 10, type: "item" },
        { name: "low-density-structure", amount: 10, type: "item" },
        { name: "rocket-fuel", amount: 10, type: "item" },
      ],
      products: [{ name: "rocket-part", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  // Military
  [
    "firearm-magazine",
    {
      name: "Firearm Magazine",
      internalName: "firearm-magazine",
      craftingTime: 1,
      ingredients: [{ name: "iron-plate", amount: 4, type: "item" }],
      products: [{ name: "firearm-magazine", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "piercing-rounds-magazine",
    {
      name: "Piercing Rounds Magazine",
      internalName: "piercing-rounds-magazine",
      craftingTime: 6,
      ingredients: [
        { name: "firearm-magazine", amount: 2, type: "item" },
        { name: "steel-plate", amount: 1, type: "item" },
        { name: "copper-plate", amount: 2, type: "item" },
      ],
      products: [{ name: "piercing-rounds-magazine", amount: 2, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "grenade",
    {
      name: "Grenade",
      internalName: "grenade",
      craftingTime: 8,
      ingredients: [
        { name: "iron-plate", amount: 5, type: "item" },
        { name: "coal", amount: 10, type: "item" },
      ],
      products: [{ name: "grenade", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "stone-wall",
    {
      name: "Stone Wall",
      internalName: "stone-wall",
      craftingTime: 0.5,
      ingredients: [{ name: "stone-brick", amount: 5, type: "item" }],
      products: [{ name: "stone-wall", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "stone-brick",
    {
      name: "Stone Brick",
      internalName: "stone-brick",
      craftingTime: 3.2,
      ingredients: [{ name: "stone", amount: 2, type: "item" }],
      products: [{ name: "stone-brick", amount: 1, type: "item" }],
      category: "smelting",
      allowProductivity: true,
    },
  ],
  // Rails and trains
  [
    "rail",
    {
      name: "Rail",
      internalName: "rail",
      craftingTime: 0.5,
      ingredients: [
        { name: "stone", amount: 1, type: "item" },
        { name: "iron-stick", amount: 1, type: "item" },
        { name: "steel-plate", amount: 1, type: "item" },
      ],
      products: [{ name: "rail", amount: 2, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  // Modules
  [
    "speed-module",
    {
      name: "Speed Module",
      internalName: "speed-module",
      craftingTime: 15,
      ingredients: [
        { name: "electronic-circuit", amount: 5, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
      ],
      products: [{ name: "speed-module", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "speed-module-2",
    {
      name: "Speed Module 2",
      internalName: "speed-module-2",
      craftingTime: 30,
      ingredients: [
        { name: "speed-module", amount: 4, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
        { name: "processing-unit", amount: 5, type: "item" },
      ],
      products: [{ name: "speed-module-2", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "speed-module-3",
    {
      name: "Speed Module 3",
      internalName: "speed-module-3",
      craftingTime: 60,
      ingredients: [
        { name: "speed-module-2", amount: 4, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
        { name: "processing-unit", amount: 5, type: "item" },
      ],
      products: [{ name: "speed-module-3", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "productivity-module",
    {
      name: "Productivity Module",
      internalName: "productivity-module",
      craftingTime: 15,
      ingredients: [
        { name: "electronic-circuit", amount: 5, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
      ],
      products: [{ name: "productivity-module", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "productivity-module-2",
    {
      name: "Productivity Module 2",
      internalName: "productivity-module-2",
      craftingTime: 30,
      ingredients: [
        { name: "productivity-module", amount: 4, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
        { name: "processing-unit", amount: 5, type: "item" },
      ],
      products: [{ name: "productivity-module-2", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "productivity-module-3",
    {
      name: "Productivity Module 3",
      internalName: "productivity-module-3",
      craftingTime: 60,
      ingredients: [
        { name: "productivity-module-2", amount: 4, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
        { name: "processing-unit", amount: 5, type: "item" },
      ],
      products: [{ name: "productivity-module-3", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "efficiency-module",
    {
      name: "Efficiency Module",
      internalName: "efficiency-module",
      craftingTime: 15,
      ingredients: [
        { name: "electronic-circuit", amount: 5, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
      ],
      products: [{ name: "efficiency-module", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "efficiency-module-2",
    {
      name: "Efficiency Module 2",
      internalName: "efficiency-module-2",
      craftingTime: 30,
      ingredients: [
        { name: "efficiency-module", amount: 4, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
        { name: "processing-unit", amount: 5, type: "item" },
      ],
      products: [{ name: "efficiency-module-2", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "efficiency-module-3",
    {
      name: "Efficiency Module 3",
      internalName: "efficiency-module-3",
      craftingTime: 60,
      ingredients: [
        { name: "efficiency-module-2", amount: 4, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
        { name: "processing-unit", amount: 5, type: "item" },
      ],
      products: [{ name: "efficiency-module-3", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  // Space Age - Quality modules
  [
    "quality-module",
    {
      name: "Quality Module",
      internalName: "quality-module",
      craftingTime: 15,
      ingredients: [
        { name: "electronic-circuit", amount: 5, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
      ],
      products: [{ name: "quality-module", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "quality-module-2",
    {
      name: "Quality Module 2",
      internalName: "quality-module-2",
      craftingTime: 30,
      ingredients: [
        { name: "quality-module", amount: 4, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
        { name: "processing-unit", amount: 5, type: "item" },
      ],
      products: [{ name: "quality-module-2", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  [
    "quality-module-3",
    {
      name: "Quality Module 3",
      internalName: "quality-module-3",
      craftingTime: 60,
      ingredients: [
        { name: "quality-module-2", amount: 4, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
        { name: "processing-unit", amount: 5, type: "item" },
      ],
      products: [{ name: "quality-module-3", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  // Machines and buildings
  [
    "electric-furnace",
    {
      name: "Electric Furnace",
      internalName: "electric-furnace",
      craftingTime: 5,
      ingredients: [
        { name: "steel-plate", amount: 10, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
        { name: "stone-brick", amount: 10, type: "item" },
      ],
      products: [{ name: "electric-furnace", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "assembling-machine-1",
    {
      name: "Assembling Machine 1",
      internalName: "assembling-machine-1",
      craftingTime: 0.5,
      ingredients: [
        { name: "electronic-circuit", amount: 3, type: "item" },
        { name: "iron-gear-wheel", amount: 5, type: "item" },
        { name: "iron-plate", amount: 9, type: "item" },
      ],
      products: [{ name: "assembling-machine-1", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "assembling-machine-2",
    {
      name: "Assembling Machine 2",
      internalName: "assembling-machine-2",
      craftingTime: 0.5,
      ingredients: [
        { name: "assembling-machine-1", amount: 1, type: "item" },
        { name: "electronic-circuit", amount: 3, type: "item" },
        { name: "iron-gear-wheel", amount: 5, type: "item" },
        { name: "steel-plate", amount: 2, type: "item" },
      ],
      products: [{ name: "assembling-machine-2", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "assembling-machine-3",
    {
      name: "Assembling Machine 3",
      internalName: "assembling-machine-3",
      craftingTime: 0.5,
      ingredients: [
        { name: "assembling-machine-2", amount: 2, type: "item" },
        { name: "speed-module", amount: 4, type: "item" },
      ],
      products: [{ name: "assembling-machine-3", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "chemical-plant",
    {
      name: "Chemical Plant",
      internalName: "chemical-plant",
      craftingTime: 5,
      ingredients: [
        { name: "steel-plate", amount: 5, type: "item" },
        { name: "iron-gear-wheel", amount: 5, type: "item" },
        { name: "electronic-circuit", amount: 5, type: "item" },
        { name: "pipe", amount: 5, type: "item" },
      ],
      products: [{ name: "chemical-plant", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "oil-refinery",
    {
      name: "Oil Refinery",
      internalName: "oil-refinery",
      craftingTime: 8,
      ingredients: [
        { name: "steel-plate", amount: 15, type: "item" },
        { name: "iron-gear-wheel", amount: 10, type: "item" },
        { name: "electronic-circuit", amount: 10, type: "item" },
        { name: "pipe", amount: 10, type: "item" },
        { name: "stone-brick", amount: 10, type: "item" },
      ],
      products: [{ name: "oil-refinery", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  // Inserters
  [
    "fast-inserter",
    {
      name: "Fast Inserter",
      internalName: "fast-inserter",
      craftingTime: 0.5,
      ingredients: [
        { name: "electronic-circuit", amount: 2, type: "item" },
        { name: "inserter", amount: 1, type: "item" },
        { name: "iron-plate", amount: 2, type: "item" },
      ],
      products: [{ name: "fast-inserter", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "bulk-inserter",
    {
      name: "Bulk Inserter",
      internalName: "bulk-inserter",
      craftingTime: 0.5,
      ingredients: [
        { name: "fast-inserter", amount: 1, type: "item" },
        { name: "iron-gear-wheel", amount: 15, type: "item" },
        { name: "electronic-circuit", amount: 15, type: "item" },
        { name: "advanced-circuit", amount: 1, type: "item" },
      ],
      products: [{ name: "bulk-inserter", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "stack-inserter",
    {
      name: "Stack Inserter",
      internalName: "stack-inserter",
      craftingTime: 0.5,
      ingredients: [
        { name: "bulk-inserter", amount: 1, type: "item" },
        { name: "iron-gear-wheel", amount: 15, type: "item" },
        { name: "processing-unit", amount: 1, type: "item" },
      ],
      products: [{ name: "stack-inserter", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "long-handed-inserter",
    {
      name: "Long Handed Inserter",
      internalName: "long-handed-inserter",
      craftingTime: 0.5,
      ingredients: [
        { name: "iron-gear-wheel", amount: 1, type: "item" },
        { name: "iron-plate", amount: 1, type: "item" },
        { name: "inserter", amount: 1, type: "item" },
      ],
      products: [{ name: "long-handed-inserter", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  // Belts
  [
    "fast-transport-belt",
    {
      name: "Fast Transport Belt",
      internalName: "fast-transport-belt",
      craftingTime: 0.5,
      ingredients: [
        { name: "iron-gear-wheel", amount: 5, type: "item" },
        { name: "transport-belt", amount: 1, type: "item" },
      ],
      products: [{ name: "fast-transport-belt", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "express-transport-belt",
    {
      name: "Express Transport Belt",
      internalName: "express-transport-belt",
      craftingTime: 0.5,
      ingredients: [
        { name: "iron-gear-wheel", amount: 10, type: "item" },
        { name: "fast-transport-belt", amount: 1, type: "item" },
        { name: "lubricant", amount: 20, type: "fluid" },
      ],
      products: [{ name: "express-transport-belt", amount: 1, type: "item" }],
      category: "crafting-with-fluid",
      allowProductivity: false,
    },
  ],
  [
    "turbo-transport-belt",
    {
      name: "Turbo Transport Belt",
      internalName: "turbo-transport-belt",
      craftingTime: 0.5,
      ingredients: [
        { name: "iron-gear-wheel", amount: 20, type: "item" },
        { name: "express-transport-belt", amount: 1, type: "item" },
        { name: "lubricant", amount: 20, type: "fluid" },
      ],
      products: [{ name: "turbo-transport-belt", amount: 1, type: "item" }],
      category: "crafting-with-fluid",
      allowProductivity: false,
    },
  ],
  // Splitters
  [
    "splitter",
    {
      name: "Splitter",
      internalName: "splitter",
      craftingTime: 1,
      ingredients: [
        { name: "electronic-circuit", amount: 5, type: "item" },
        { name: "iron-plate", amount: 5, type: "item" },
        { name: "transport-belt", amount: 4, type: "item" },
      ],
      products: [{ name: "splitter", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "fast-splitter",
    {
      name: "Fast Splitter",
      internalName: "fast-splitter",
      craftingTime: 2,
      ingredients: [
        { name: "splitter", amount: 1, type: "item" },
        { name: "iron-gear-wheel", amount: 10, type: "item" },
        { name: "electronic-circuit", amount: 10, type: "item" },
      ],
      products: [{ name: "fast-splitter", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "express-splitter",
    {
      name: "Express Splitter",
      internalName: "express-splitter",
      craftingTime: 2,
      ingredients: [
        { name: "fast-splitter", amount: 1, type: "item" },
        { name: "iron-gear-wheel", amount: 10, type: "item" },
        { name: "advanced-circuit", amount: 10, type: "item" },
        { name: "lubricant", amount: 80, type: "fluid" },
      ],
      products: [{ name: "express-splitter", amount: 1, type: "item" }],
      category: "crafting-with-fluid",
      allowProductivity: false,
    },
  ],
  // Underground belts
  [
    "underground-belt",
    {
      name: "Underground Belt",
      internalName: "underground-belt",
      craftingTime: 1,
      ingredients: [
        { name: "iron-plate", amount: 10, type: "item" },
        { name: "transport-belt", amount: 5, type: "item" },
      ],
      products: [{ name: "underground-belt", amount: 2, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "fast-underground-belt",
    {
      name: "Fast Underground Belt",
      internalName: "fast-underground-belt",
      craftingTime: 2,
      ingredients: [
        { name: "iron-gear-wheel", amount: 40, type: "item" },
        { name: "underground-belt", amount: 2, type: "item" },
      ],
      products: [{ name: "fast-underground-belt", amount: 2, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "express-underground-belt",
    {
      name: "Express Underground Belt",
      internalName: "express-underground-belt",
      craftingTime: 2,
      ingredients: [
        { name: "iron-gear-wheel", amount: 80, type: "item" },
        { name: "fast-underground-belt", amount: 2, type: "item" },
        { name: "lubricant", amount: 40, type: "fluid" },
      ],
      products: [{ name: "express-underground-belt", amount: 2, type: "item" }],
      category: "crafting-with-fluid",
      allowProductivity: false,
    },
  ],
  // Power
  [
    "solar-panel",
    {
      name: "Solar Panel",
      internalName: "solar-panel",
      craftingTime: 10,
      ingredients: [
        { name: "steel-plate", amount: 5, type: "item" },
        { name: "electronic-circuit", amount: 15, type: "item" },
        { name: "copper-plate", amount: 5, type: "item" },
      ],
      products: [{ name: "solar-panel", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "accumulator",
    {
      name: "Accumulator",
      internalName: "accumulator",
      craftingTime: 10,
      ingredients: [
        { name: "iron-plate", amount: 2, type: "item" },
        { name: "battery", amount: 5, type: "item" },
      ],
      products: [{ name: "accumulator", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  // Electric poles
  [
    "small-electric-pole",
    {
      name: "Small Electric Pole",
      internalName: "small-electric-pole",
      craftingTime: 0.5,
      ingredients: [
        { name: "wood", amount: 1, type: "item" },
        { name: "copper-cable", amount: 2, type: "item" },
      ],
      products: [{ name: "small-electric-pole", amount: 2, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "medium-electric-pole",
    {
      name: "Medium Electric Pole",
      internalName: "medium-electric-pole",
      craftingTime: 0.5,
      ingredients: [
        { name: "steel-plate", amount: 2, type: "item" },
        { name: "copper-cable", amount: 2, type: "item" },
      ],
      products: [{ name: "medium-electric-pole", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "big-electric-pole",
    {
      name: "Big Electric Pole",
      internalName: "big-electric-pole",
      craftingTime: 0.5,
      ingredients: [
        { name: "steel-plate", amount: 5, type: "item" },
        { name: "copper-cable", amount: 5, type: "item" },
      ],
      products: [{ name: "big-electric-pole", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "substation",
    {
      name: "Substation",
      internalName: "substation",
      craftingTime: 0.5,
      ingredients: [
        { name: "steel-plate", amount: 10, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
        { name: "copper-cable", amount: 5, type: "item" },
      ],
      products: [{ name: "substation", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  // Pipes
  [
    "pipe-to-ground",
    {
      name: "Pipe to Ground",
      internalName: "pipe-to-ground",
      craftingTime: 0.5,
      ingredients: [
        { name: "pipe", amount: 10, type: "item" },
        { name: "iron-plate", amount: 5, type: "item" },
      ],
      products: [{ name: "pipe-to-ground", amount: 2, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "pump",
    {
      name: "Pump",
      internalName: "pump",
      craftingTime: 2,
      ingredients: [
        { name: "engine-unit", amount: 1, type: "item" },
        { name: "steel-plate", amount: 1, type: "item" },
        { name: "pipe", amount: 1, type: "item" },
      ],
      products: [{ name: "pump", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "storage-tank",
    {
      name: "Storage Tank",
      internalName: "storage-tank",
      craftingTime: 3,
      ingredients: [
        { name: "iron-plate", amount: 20, type: "item" },
        { name: "steel-plate", amount: 5, type: "item" },
      ],
      products: [{ name: "storage-tank", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  // Logistics
  [
    "roboport",
    {
      name: "Roboport",
      internalName: "roboport",
      craftingTime: 5,
      ingredients: [
        { name: "steel-plate", amount: 45, type: "item" },
        { name: "iron-gear-wheel", amount: 45, type: "item" },
        { name: "advanced-circuit", amount: 45, type: "item" },
      ],
      products: [{ name: "roboport", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  // Chests
  [
    "wooden-chest",
    {
      name: "Wooden Chest",
      internalName: "wooden-chest",
      craftingTime: 0.5,
      ingredients: [{ name: "wood", amount: 2, type: "item" }],
      products: [{ name: "wooden-chest", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "iron-chest",
    {
      name: "Iron Chest",
      internalName: "iron-chest",
      craftingTime: 0.5,
      ingredients: [{ name: "iron-plate", amount: 8, type: "item" }],
      products: [{ name: "iron-chest", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "steel-chest",
    {
      name: "Steel Chest",
      internalName: "steel-chest",
      craftingTime: 0.5,
      ingredients: [{ name: "steel-plate", amount: 8, type: "item" }],
      products: [{ name: "steel-chest", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  // Explosives
  [
    "explosives",
    {
      name: "Explosives",
      internalName: "explosives",
      craftingTime: 4,
      ingredients: [
        { name: "sulfur", amount: 1, type: "item" },
        { name: "coal", amount: 1, type: "item" },
        { name: "water", amount: 10, type: "fluid" },
      ],
      products: [{ name: "explosives", amount: 2, type: "item" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  // Uranium processing
  [
    "uranium-processing",
    {
      name: "Uranium Processing",
      internalName: "uranium-processing",
      craftingTime: 12,
      ingredients: [{ name: "uranium-ore", amount: 10, type: "item" }],
      products: [
        { name: "uranium-235", amount: 1, type: "item", probability: 0.007 },
        { name: "uranium-238", amount: 1, type: "item", probability: 0.993 },
      ],
      category: "centrifuging",
      allowProductivity: true,
    },
  ],
  [
    "kovarex-enrichment-process",
    {
      name: "Kovarex Enrichment Process",
      internalName: "kovarex-enrichment-process",
      craftingTime: 60,
      ingredients: [
        { name: "uranium-235", amount: 40, type: "item" },
        { name: "uranium-238", amount: 5, type: "item" },
      ],
      products: [
        { name: "uranium-235", amount: 41, type: "item" },
        { name: "uranium-238", amount: 2, type: "item" },
      ],
      category: "centrifuging",
      allowProductivity: true,
    },
  ],
  [
    "uranium-fuel-cell",
    {
      name: "Uranium Fuel Cell",
      internalName: "uranium-fuel-cell",
      craftingTime: 10,
      ingredients: [
        { name: "iron-plate", amount: 10, type: "item" },
        { name: "uranium-235", amount: 1, type: "item" },
        { name: "uranium-238", amount: 19, type: "item" },
      ],
      products: [{ name: "uranium-fuel-cell", amount: 10, type: "item" }],
      category: "crafting",
      allowProductivity: true,
    },
  ],
  // Space Age specific recipes
  [
    "superconductor",
    {
      name: "Superconductor",
      internalName: "superconductor",
      craftingTime: 5,
      ingredients: [
        { name: "copper-plate", amount: 1, type: "item" },
        { name: "plastic-bar", amount: 1, type: "item" },
        { name: "iron-plate", amount: 1, type: "item" },
        { name: "light-oil", amount: 5, type: "fluid" },
      ],
      products: [{ name: "superconductor", amount: 2, type: "item" }],
      category: "electromagnetics",
      allowProductivity: true,
    },
  ],
  [
    "supercapacitor",
    {
      name: "Supercapacitor",
      internalName: "supercapacitor",
      craftingTime: 10,
      ingredients: [
        { name: "battery", amount: 1, type: "item" },
        { name: "electronic-circuit", amount: 4, type: "item" },
        { name: "superconductor", amount: 2, type: "item" },
        { name: "holmium-plate", amount: 2, type: "item" },
      ],
      products: [{ name: "supercapacitor", amount: 1, type: "item" }],
      category: "electromagnetics",
      allowProductivity: true,
    },
  ],
  [
    "holmium-plate",
    {
      name: "Holmium Plate",
      internalName: "holmium-plate",
      craftingTime: 1,
      ingredients: [
        { name: "holmium-ore", amount: 2, type: "item" },
        { name: "stone", amount: 1, type: "item" },
      ],
      products: [{ name: "holmium-plate", amount: 1, type: "item" }],
      category: "electromagnetics",
      allowProductivity: true,
    },
  ],
  [
    "electrolyte",
    {
      name: "Electrolyte",
      internalName: "electrolyte",
      craftingTime: 2,
      ingredients: [
        { name: "holmium-ore", amount: 1, type: "item" },
        { name: "stone", amount: 1, type: "item" },
        { name: "heavy-oil", amount: 10, type: "fluid" },
      ],
      products: [{ name: "electrolyte", amount: 10, type: "fluid" }],
      category: "electromagnetics",
      allowProductivity: true,
    },
  ],
  [
    "holmium-solution",
    {
      name: "Holmium Solution",
      internalName: "holmium-solution",
      craftingTime: 10,
      ingredients: [
        { name: "holmium-ore", amount: 2, type: "item" },
        { name: "water", amount: 100, type: "fluid" },
      ],
      products: [{ name: "holmium-solution", amount: 100, type: "fluid" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  // Space platform recipes
  [
    "space-platform-foundation",
    {
      name: "Space Platform Foundation",
      internalName: "space-platform-foundation",
      craftingTime: 10,
      ingredients: [
        { name: "steel-plate", amount: 10, type: "item" },
        { name: "copper-cable", amount: 10, type: "item" },
      ],
      products: [{ name: "space-platform-foundation", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "cargo-bay",
    {
      name: "Cargo Bay",
      internalName: "cargo-bay",
      craftingTime: 10,
      ingredients: [
        { name: "steel-plate", amount: 20, type: "item" },
        { name: "low-density-structure", amount: 1, type: "item" },
        { name: "advanced-circuit", amount: 5, type: "item" },
      ],
      products: [{ name: "cargo-bay", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "asteroid-collector",
    {
      name: "Asteroid Collector",
      internalName: "asteroid-collector",
      craftingTime: 20,
      ingredients: [
        { name: "steel-plate", amount: 10, type: "item" },
        { name: "electronic-circuit", amount: 10, type: "item" },
        { name: "engine-unit", amount: 5, type: "item" },
      ],
      products: [{ name: "asteroid-collector", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "thruster",
    {
      name: "Thruster",
      internalName: "thruster",
      craftingTime: 30,
      ingredients: [
        { name: "steel-plate", amount: 10, type: "item" },
        { name: "engine-unit", amount: 10, type: "item" },
        { name: "pipe", amount: 20, type: "item" },
      ],
      products: [{ name: "thruster", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  // Asteroid recipes
  [
    "metallic-asteroid-crushing",
    {
      name: "Metallic Asteroid Crushing",
      internalName: "metallic-asteroid-crushing",
      craftingTime: 2,
      ingredients: [{ name: "metallic-asteroid-chunk", amount: 1, type: "item" }],
      products: [
        { name: "iron-ore", amount: 20, type: "item" },
        { name: "copper-ore", amount: 6, type: "item", probability: 0.8 },
      ],
      category: "crushing",
      allowProductivity: true,
    },
  ],
  [
    "carbonic-asteroid-crushing",
    {
      name: "Carbonic Asteroid Crushing",
      internalName: "carbonic-asteroid-crushing",
      craftingTime: 2,
      ingredients: [{ name: "carbonic-asteroid-chunk", amount: 1, type: "item" }],
      products: [
        { name: "carbon", amount: 10, type: "item" },
        { name: "sulfur", amount: 2, type: "item", probability: 0.5 },
      ],
      category: "crushing",
      allowProductivity: true,
    },
  ],
  [
    "oxide-asteroid-crushing",
    {
      name: "Oxide Asteroid Crushing",
      internalName: "oxide-asteroid-crushing",
      craftingTime: 2,
      ingredients: [{ name: "oxide-asteroid-chunk", amount: 1, type: "item" }],
      products: [
        { name: "ice", amount: 5, type: "item" },
        { name: "calcite", amount: 2, type: "item", probability: 0.4 },
      ],
      category: "crushing",
      allowProductivity: true,
    },
  ],
  // Ice processing
  [
    "ice-melting",
    {
      name: "Ice Melting",
      internalName: "ice-melting",
      craftingTime: 1,
      ingredients: [{ name: "ice", amount: 1, type: "item" }],
      products: [
        { name: "water", amount: 20, type: "fluid" },
      ],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  // Carbon recipes
  [
    "carbon",
    {
      name: "Carbon",
      internalName: "carbon",
      craftingTime: 1,
      ingredients: [
        { name: "coal", amount: 2, type: "item" },
        { name: "sulfuric-acid", amount: 20, type: "fluid" },
      ],
      products: [{ name: "carbon", amount: 1, type: "item" }],
      category: "chemistry",
      allowProductivity: true,
    },
  ],
  [
    "carbon-fiber",
    {
      name: "Carbon Fiber",
      internalName: "carbon-fiber",
      craftingTime: 2,
      ingredients: [
        { name: "carbon", amount: 4, type: "item" },
        { name: "heavy-oil", amount: 4, type: "fluid" },
      ],
      products: [{ name: "carbon-fiber", amount: 1, type: "item" }],
      category: "crafting-with-fluid",
      allowProductivity: true,
    },
  ],
  // Beacon
  [
    "beacon",
    {
      name: "Beacon",
      internalName: "beacon",
      craftingTime: 15,
      ingredients: [
        { name: "electronic-circuit", amount: 20, type: "item" },
        { name: "advanced-circuit", amount: 20, type: "item" },
        { name: "steel-plate", amount: 10, type: "item" },
        { name: "copper-cable", amount: 10, type: "item" },
      ],
      products: [{ name: "beacon", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  // Satellite
  [
    "satellite",
    {
      name: "Satellite",
      internalName: "satellite",
      craftingTime: 5,
      ingredients: [
        { name: "low-density-structure", amount: 100, type: "item" },
        { name: "solar-panel", amount: 100, type: "item" },
        { name: "accumulator", amount: 100, type: "item" },
        { name: "radar", amount: 5, type: "item" },
        { name: "processing-unit", amount: 100, type: "item" },
        { name: "rocket-fuel", amount: 50, type: "item" },
      ],
      products: [{ name: "satellite", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
    },
  ],
  [
    "radar",
    {
      name: "Radar",
      internalName: "radar",
      craftingTime: 0.5,
      ingredients: [
        { name: "electronic-circuit", amount: 5, type: "item" },
        { name: "iron-gear-wheel", amount: 5, type: "item" },
        { name: "iron-plate", amount: 10, type: "item" },
      ],
      products: [{ name: "radar", amount: 1, type: "item" }],
      category: "crafting",
      allowProductivity: false,
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

/**
 * Finds a recipe by its ingredient name for a specific category.
 * Useful for inferring recipes in machines like electric furnaces that don't store recipe in blueprints.
 */
export function getRecipeByIngredient(
  ingredientName: string,
  category: RecipeCategory
): Recipe | undefined {
  for (const [, recipe] of RECIPES) {
    if (recipe.category !== category) continue;
    // Check if this recipe uses the ingredient as an input
    const hasIngredient = recipe.ingredients.some(
      (ing) => ing.name === ingredientName
    );
    if (hasIngredient) {
      return recipe;
    }
  }
  return undefined;
}
