import { h } from "preact";
import { useState, useMemo, useEffect } from "preact/hooks";
import { decodeBlueprint, encodeBlueprint, buildBlueprintTree, type BlueprintTreeNode } from "./browserDecoder.js";
import { BlueprintAnalyzer } from "../analyzer.js";
import { getDisplayName } from "../gameData.js";
import type { Blueprint, BlueprintString, AnalysisResult } from "../types.js";

interface AppState {
  blueprintInput: string;
  selectedBlueprint: Blueprint | null;
  selectedPath: number[];  // Path to the selected blueprint in the tree (array of indices)
  analysisResult: AnalysisResult | null;
  error: string | null;
  overwriteName: boolean;
  overwriteDescription: boolean;
  appendDescription: boolean;
  useRichText: boolean;
}

/**
 * Format rates to a consistent string format
 */
function formatRate(rate: number): string {
  return rate.toFixed(1);
}

/**
 * Formats a rate string with optional rich text formatting
 * When useRichText is true, wraps the rate with [font=compi]...[/font]
 */
function formatRateString(rate: number, suffix: string, useRichText: boolean): string {
  const rateStr = `${formatRate(rate)}${suffix}`;
  if (useRichText) {
    return `[font=compi]${rateStr}[/font]`;
  }
  return rateStr;
}

/**
 * Formats an item name with optional rich text formatting
 * When useRichText is true, uses [item=xxx] format instead of display name
 */
function formatItemName(internalName: string, useRichText: boolean): string {
  if (useRichText) {
    return `[item=${internalName}]`;
  }
  return getDisplayName(internalName);
}

/**
 * Generates the throughput name for a blueprint based on outputs
 */
function generateThroughputName(result: AnalysisResult, useRichText: boolean): string {
  if (result.externalOutputs.size === 0) {
    return "No outputs";
  }
  
  const outputStrings: string[] = [];
  for (const [item, rate] of result.externalOutputs) {
    const rateStr = formatRateString(rate, "/s", useRichText);
    const itemName = formatItemName(item, useRichText);
    outputStrings.push(`${rateStr} ${itemName}`);
  }
  
  return outputStrings.join(", ");
}

/**
 * Generates the description text with input/output rates
 */
function generateRatesDescription(result: AnalysisResult, useRichText: boolean): string {
  const lines: string[] = [];
  
  if (result.externalInputs.size > 0) {
    lines.push("Inputs:");
    for (const [item, rate] of result.externalInputs) {
      const rateStr = formatRateString(rate, "/s", useRichText);
      const itemName = formatItemName(item, useRichText);
      lines.push(`  ${rateStr} ${itemName}`);
    }
  }
  
  if (result.externalOutputs.size > 0) {
    if (lines.length > 0) lines.push("");
    lines.push("Outputs:");
    for (const [item, rate] of result.externalOutputs) {
      const rateStr = formatRateString(rate, "/s", useRichText);
      const itemName = formatItemName(item, useRichText);
      lines.push(`  ${rateStr} ${itemName}`);
    }
  }
  
  return lines.join("\n");
}

/**
 * Tree view component for blueprint books
 */
function BlueprintTreeView({ 
  nodes, 
  onSelect, 
  selectedPath,
  currentPath = []
}: { 
  nodes: BlueprintTreeNode[]; 
  onSelect: (bp: Blueprint, path: number[]) => void;
  selectedPath: number[];
  currentPath?: number[];
}) {
  const depth = currentPath.length;
  return (
    <ul class="blueprint-tree" style={{ marginLeft: depth > 0 ? "16px" : "0" }}>
      {nodes.map((node, idx) => {
        const nodePath = [...currentPath, idx];
        const isSelected = selectedPath.length === nodePath.length && 
          selectedPath.every((v, i) => v === nodePath[i]);
        
        return (
          <li key={idx} class={`tree-node ${node.type}`}>
            {node.type === "book" ? (
              <div>
                <span class="book-icon">📘</span>
                <span class="book-label">{node.label}</span>
                {node.children && (
                  <BlueprintTreeView 
                    nodes={node.children} 
                    onSelect={onSelect}
                    selectedPath={selectedPath}
                    currentPath={nodePath}
                  />
                )}
              </div>
            ) : (
              <button
                class={`blueprint-button ${isSelected ? "selected" : ""}`}
                onClick={() => node.blueprint && onSelect(node.blueprint, nodePath)}
              >
                <span class="blueprint-icon">📋</span>
                {node.label}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Analysis result display component
 */
function AnalysisDisplay({ result }: { result: AnalysisResult }) {
  return (
    <div class="analysis-result">
      <h3>Analysis: {result.blueprintName || result.filename}</h3>
      
      <div class="flow-section">
        <h4>Inputs</h4>
        {result.externalInputs.size > 0 ? (
          <ul class="flow-list">
            {Array.from(result.externalInputs).map(([item, rate]) => (
              <li key={item} class="flow-item input">
                <span class="rate">{formatRate(rate)}/s</span>
                <span class="item-name">{getDisplayName(item)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p class="empty-message">None</p>
        )}
      </div>
      
      <div class="flow-section">
        <h4>Outputs</h4>
        {result.externalOutputs.size > 0 ? (
          <ul class="flow-list">
            {Array.from(result.externalOutputs).map(([item, rate]) => (
              <li key={item} class="flow-item output">
                <span class="rate">{formatRate(rate)}/s</span>
                <span class="item-name">{getDisplayName(item)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p class="empty-message">None</p>
        )}
      </div>
      
      <div class="flow-section">
        <h4>Utilization</h4>
        <ul class="utilization-list">
          {Array.from(result.utilization)
            .sort((a, b) => b[1].avgUtilization - a[1].avgUtilization)
            .map(([key, data]) => (
              <li key={key} class="utilization-item">
                <span class="machine-name">{key} x{data.count}</span>
                <span class="utilization-bar">
                  <span 
                    class="utilization-fill" 
                    style={{ width: `${data.avgUtilization * 100}%` }}
                  />
                </span>
                <span class="utilization-percent">{(data.avgUtilization * 100).toFixed(0)}%</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Find the first blueprint in the tree and return it with its path
 */
function findFirstBlueprint(nodes: BlueprintTreeNode[], currentPath: number[] = []): { blueprint: Blueprint; path: number[] } | null {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!;
    const nodePath = [...currentPath, i];
    
    if (node.type === "blueprint" && node.blueprint) {
      return { blueprint: node.blueprint, path: nodePath };
    }
    
    if (node.type === "book" && node.children) {
      const result = findFirstBlueprint(node.children, nodePath);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

export function App() {
  const [state, setState] = useState<AppState>({
    blueprintInput: "",
    selectedBlueprint: null,
    selectedPath: [],
    analysisResult: null,
    error: null,
    overwriteName: false,
    overwriteDescription: false,
    appendDescription: false,
    useRichText: false,
  });

  // Parse blueprint and build tree
  const { decoded, tree, parseError } = useMemo(() => {
    if (!state.blueprintInput.trim()) {
      return { decoded: null, tree: [], parseError: null };
    }
    try {
      const decoded = decodeBlueprint(state.blueprintInput);
      const tree = buildBlueprintTree(decoded);
      return { decoded, tree, parseError: null };
    } catch (e) {
      return { decoded: null, tree: [], parseError: e instanceof Error ? e.message : String(e) };
    }
  }, [state.blueprintInput]);

  // Analyze and select a blueprint
  const selectBlueprint = (blueprint: Blueprint, path: number[]) => {
    try {
      const analyzer = new BlueprintAnalyzer(blueprint);
      const result = analyzer.analyze(blueprint.label || "Selected Blueprint");
      result.blueprintName = blueprint.label;
      setState(prev => ({
        ...prev,
        selectedBlueprint: blueprint,
        selectedPath: path,
        analysisResult: result,
        error: null,
      }));
    } catch (e) {
      setState(prev => ({
        ...prev,
        selectedBlueprint: blueprint,
        selectedPath: path,
        analysisResult: null,
        error: e instanceof Error ? e.message : String(e),
      }));
    }
  };

  // Auto-select first blueprint when tree changes
  useEffect(() => {
    if (tree.length > 0) {
      const first = findFirstBlueprint(tree);
      if (first) {
        selectBlueprint(first.blueprint, first.path);
      }
    }
  }, [tree]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setState(prev => ({
      ...prev,
      blueprintInput: value,
      selectedBlueprint: null,
      selectedPath: [],
      analysisResult: null,
      error: null,
    }));
  };

  // Handle blueprint selection from tree
  const handleBlueprintSelect = (blueprint: Blueprint, path: number[]) => {
    selectBlueprint(blueprint, path);
  };

  // Generate modified blueprint string
  const modifiedBlueprint = useMemo(() => {
    if (!decoded || !state.analysisResult || !state.selectedBlueprint || state.selectedPath.length === 0) {
      return "";
    }

    // Deep clone the decoded data
    const modified: BlueprintString = JSON.parse(JSON.stringify(decoded));
    
    // Apply modifications to the blueprint at the given path
    const applyModifications = (bp: Blueprint): void => {
      if (state.overwriteName) {
        bp.label = generateThroughputName(state.analysisResult!, state.useRichText);
      }
      
      const ratesDescription = generateRatesDescription(state.analysisResult!, state.useRichText);
      
      if (state.overwriteDescription) {
        bp.description = ratesDescription;
      } else if (state.appendDescription) {
        const existingDesc = bp.description || "";
        bp.description = existingDesc 
          ? existingDesc + "\n\n" + ratesDescription 
          : ratesDescription;
      }
    };

    // Navigate to the blueprint using the path and apply modifications
    const path = state.selectedPath;
    
    // For single blueprint (path is [0])
    if (modified.blueprint && path.length === 1 && path[0] === 0) {
      applyModifications(modified.blueprint);
    }

    // For blueprint book, navigate using the path
    if (modified.blueprint_book) {
      type BookEntry = { blueprint?: Blueprint; blueprint_book?: { blueprints: BookEntry[] }; index: number };
      let current: { blueprints: BookEntry[] } | undefined = modified.blueprint_book as { blueprints: BookEntry[] };
      
      for (let i = 0; i < path.length; i++) {
        const idx = path[i];
        if (!current || idx === undefined || !current.blueprints[idx]) break;
        
        const entry = current.blueprints[idx];
        if (i === path.length - 1) {
          // Last index - this should be the blueprint
          if (entry?.blueprint) {
            applyModifications(entry.blueprint);
          }
        } else {
          // Navigate into nested book
          if (entry?.blueprint_book) {
            current = entry.blueprint_book;
          } else {
            break;
          }
        }
      }
    }

    // Only generate output if any modification option is selected
    if (!state.overwriteName && !state.overwriteDescription && !state.appendDescription) {
      return "";
    }

    try {
      return encodeBlueprint(modified);
    } catch (e) {
      return `Error encoding: ${e instanceof Error ? e.message : String(e)}`;
    }
  }, [decoded, state.selectedBlueprint, state.analysisResult, state.overwriteName, state.overwriteDescription, state.appendDescription, state.useRichText]);

  return (
    <div class="app">
      <header>
        <h1>🏭 Factorio Blueprint Investigator</h1>
        <p>Analyze production rates and throughput for your Factorio blueprints</p>
      </header>

      <main>
        <section class="input-section">
          <h2>Blueprint Input</h2>
          <textarea
            placeholder="Paste your blueprint string here..."
            value={state.blueprintInput}
            onInput={(e) => handleInputChange((e.target as HTMLTextAreaElement).value)}
            rows={6}
          />
          {parseError && <div class="error-message">{parseError}</div>}
        </section>

        {tree.length > 0 && (
          <div class="split-layout">
            <section class="blueprints-section">
              <h2>Blueprints</h2>
              <div class="blueprint-list-container">
                <BlueprintTreeView 
                  nodes={tree} 
                  onSelect={handleBlueprintSelect}
                  selectedPath={state.selectedPath}
                />
              </div>
            </section>

            <div class="details-panel">
              {state.error && <div class="error-message">{state.error}</div>}

              {state.analysisResult && (
                <section class="analysis-section">
                  <AnalysisDisplay result={state.analysisResult} />
                </section>
              )}

              {state.analysisResult && (
                <section class="output-section">
                  <h2>Output Options</h2>
                  <div class="options">
                    <label>
                      <input
                        type="checkbox"
                        checked={state.overwriteName}
                        onChange={(e) => setState(prev => ({
                          ...prev,
                          overwriteName: (e.target as HTMLInputElement).checked
                        }))}
                      />
                      Overwrite Name (sets name to throughput rate, e.g. "32.4 Iron Gear Wheel /s")
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={state.overwriteDescription}
                        onChange={(e) => setState(prev => ({
                          ...prev,
                          overwriteDescription: (e.target as HTMLInputElement).checked,
                          appendDescription: false
                          }))}
                      />
                      Overwrite Description (replaces description with input/output rates)
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={state.appendDescription}
                        onChange={(e) => setState(prev => ({
                          ...prev,
                          appendDescription: (e.target as HTMLInputElement).checked,
                          overwriteDescription: false
                        }))}
                      />
                      Append Description (adds input/output rates to existing description)
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={state.useRichText}
                        onChange={(e) => setState(prev => ({
                          ...prev,
                          useRichText: (e.target as HTMLInputElement).checked
                        }))}
                      />
                      Use Rich Text (uses Factorio rich text icons like [item=iron-gear-wheel] and [font=compi] for rates)
                    </label>
                  </div>

                  {modifiedBlueprint && (
                    <div class="output-blueprint">
                      <h3>Modified Blueprint String</h3>
                      <textarea
                        value={modifiedBlueprint}
                        readOnly
                        rows={4}
                        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                      />
                      <button 
                        class="copy-button"
                        onClick={() => navigator.clipboard.writeText(modifiedBlueprint)}
                      >
                        📋 Copy to Clipboard
                      </button>
                    </div>
                  )}
                </section>
              )}

              {!state.analysisResult && !state.error && (
                <div class="empty-details">
                  <p>Select a blueprint from the list to see its analysis</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer>
        <p>Factorio Blueprint Investigator (FBI) - Analyze production rates for your blueprints</p>
      </footer>
    </div>
  );
}
