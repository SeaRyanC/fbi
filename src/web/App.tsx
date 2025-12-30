import { h } from "preact";
import { useState, useMemo } from "preact/hooks";
import { decodeBlueprint, encodeBlueprint, buildBlueprintTree, type BlueprintTreeNode } from "./browserDecoder.js";
import { BlueprintAnalyzer } from "../analyzer.js";
import { getDisplayName } from "../gameData.js";
import type { Blueprint, BlueprintString, AnalysisResult } from "../types.js";

interface AppState {
  blueprintInput: string;
  selectedBlueprint: Blueprint | null;
  analysisResult: AnalysisResult | null;
  error: string | null;
  overwriteName: boolean;
  overwriteDescription: boolean;
  appendDescription: boolean;
}

/**
 * Format rates to a consistent string format
 */
function formatRate(rate: number): string {
  return rate.toFixed(1);
}

/**
 * Generates the throughput name for a blueprint based on outputs
 */
function generateThroughputName(result: AnalysisResult): string {
  if (result.externalOutputs.size === 0) {
    return "No outputs";
  }
  
  const outputStrings: string[] = [];
  for (const [item, rate] of result.externalOutputs) {
    outputStrings.push(`${formatRate(rate)} ${getDisplayName(item)}`);
  }
  
  return outputStrings.join(", ") + " /s";
}

/**
 * Generates the description text with input/output rates
 */
function generateRatesDescription(result: AnalysisResult): string {
  const lines: string[] = [];
  
  if (result.externalInputs.size > 0) {
    lines.push("Inputs:");
    for (const [item, rate] of result.externalInputs) {
      lines.push(`  ${formatRate(rate)}/s ${getDisplayName(item)}`);
    }
  }
  
  if (result.externalOutputs.size > 0) {
    if (lines.length > 0) lines.push("");
    lines.push("Outputs:");
    for (const [item, rate] of result.externalOutputs) {
      lines.push(`  ${formatRate(rate)}/s ${getDisplayName(item)}`);
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
  selectedBlueprint,
  depth = 0 
}: { 
  nodes: BlueprintTreeNode[]; 
  onSelect: (bp: Blueprint) => void;
  selectedBlueprint: Blueprint | null;
  depth?: number;
}) {
  return (
    <ul class="blueprint-tree" style={{ marginLeft: depth > 0 ? "16px" : "0" }}>
      {nodes.map((node, idx) => (
        <li key={idx} class={`tree-node ${node.type}`}>
          {node.type === "book" ? (
            <div>
              <span class="book-icon">📘</span>
              <span class="book-label">{node.label}</span>
              {node.children && (
                <BlueprintTreeView 
                  nodes={node.children} 
                  onSelect={onSelect}
                  selectedBlueprint={selectedBlueprint}
                  depth={depth + 1} 
                />
              )}
            </div>
          ) : (
            <button
              class={`blueprint-button ${selectedBlueprint === node.blueprint ? "selected" : ""}`}
              onClick={() => node.blueprint && onSelect(node.blueprint)}
            >
              <span class="blueprint-icon">📋</span>
              {node.label}
            </button>
          )}
        </li>
      ))}
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

export function App() {
  const [state, setState] = useState<AppState>({
    blueprintInput: "",
    selectedBlueprint: null,
    analysisResult: null,
    error: null,
    overwriteName: false,
    overwriteDescription: false,
    appendDescription: false,
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

  // Auto-select first blueprint when input changes
  const handleInputChange = (value: string) => {
    setState(prev => ({
      ...prev,
      blueprintInput: value,
      selectedBlueprint: null,
      analysisResult: null,
      error: null,
    }));
  };

  // Analyze selected blueprint
  const handleBlueprintSelect = (blueprint: Blueprint) => {
    try {
      const analyzer = new BlueprintAnalyzer(blueprint);
      const result = analyzer.analyze(blueprint.label || "Selected Blueprint");
      result.blueprintName = blueprint.label;
      setState(prev => ({
        ...prev,
        selectedBlueprint: blueprint,
        analysisResult: result,
        error: null,
      }));
    } catch (e) {
      setState(prev => ({
        ...prev,
        selectedBlueprint: blueprint,
        analysisResult: null,
        error: e instanceof Error ? e.message : String(e),
      }));
    }
  };

  // Generate modified blueprint string
  const modifiedBlueprint = useMemo(() => {
    if (!decoded || !state.analysisResult || !state.selectedBlueprint) {
      return "";
    }

    // Deep clone the decoded data
    const modified: BlueprintString = JSON.parse(JSON.stringify(decoded));
    
    // Find and modify the selected blueprint in the tree
    const modifyBlueprint = (bp: Blueprint): boolean => {
      // Match by comparing entities (or label if available)
      if (bp === state.selectedBlueprint || 
          (bp.label === state.selectedBlueprint?.label && bp.entities.length === state.selectedBlueprint?.entities.length)) {
        
        if (state.overwriteName) {
          bp.label = generateThroughputName(state.analysisResult!);
        }
        
        const ratesDescription = generateRatesDescription(state.analysisResult!);
        
        if (state.overwriteDescription) {
          (bp as Blueprint & { description?: string }).description = ratesDescription;
        } else if (state.appendDescription) {
          const existingDesc = (bp as Blueprint & { description?: string }).description || "";
          (bp as Blueprint & { description?: string }).description = existingDesc 
            ? existingDesc + "\n\n" + ratesDescription 
            : ratesDescription;
        }
        
        return true;
      }
      return false;
    };

    // For single blueprint
    if (modified.blueprint) {
      modifyBlueprint(modified.blueprint);
    }

    // For blueprint book, we need to find and modify the matching blueprint
    const modifyInBook = (book: { blueprints: Array<{ blueprint?: Blueprint; blueprint_book?: unknown; index: number }> }): boolean => {
      for (const entry of book.blueprints) {
        if (entry.blueprint && modifyBlueprint(entry.blueprint)) {
          return true;
        }
        if (entry.blueprint_book) {
          if (modifyInBook(entry.blueprint_book as { blueprints: Array<{ blueprint?: Blueprint; blueprint_book?: unknown; index: number }> })) {
            return true;
          }
        }
      }
      return false;
    };

    if (modified.blueprint_book) {
      modifyInBook(modified.blueprint_book as { blueprints: Array<{ blueprint?: Blueprint; blueprint_book?: unknown; index: number }> });
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
  }, [decoded, state.selectedBlueprint, state.analysisResult, state.overwriteName, state.overwriteDescription, state.appendDescription]);

  return (
    <div class="app">
      <header>
        <h1>🏭 Factorio Blueprint Analyzer</h1>
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
          <section class="blueprints-section">
            <h2>Blueprints</h2>
            <BlueprintTreeView 
              nodes={tree} 
              onSelect={handleBlueprintSelect}
              selectedBlueprint={state.selectedBlueprint}
            />
          </section>
        )}

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
      </main>

      <footer>
        <p>Factorio Blueprint Analyzer (FBI) - Analyze production rates for your blueprints</p>
      </footer>
    </div>
  );
}
