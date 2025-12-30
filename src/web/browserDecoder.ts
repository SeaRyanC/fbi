/**
 * Browser-compatible Factorio Blueprint Decoder
 * Uses pako instead of node:zlib for browser compatibility
 */

import pako from "pako";
import type { BlueprintString, Blueprint, BlueprintBook } from "../types.js";

/**
 * Decodes a Factorio blueprint string in the browser
 * Format: version_byte + base64(zlib(json))
 */
export function decodeBlueprint(blueprintString: string): BlueprintString {
  const trimmed = blueprintString.trim();

  if (trimmed.length < 2) {
    throw new Error("Invalid blueprint string: too short");
  }

  // First character is version byte (should be '0' for current versions)
  const versionByte = trimmed[0];
  if (versionByte !== "0") {
    throw new Error(`Unsupported blueprint version: ${versionByte}`);
  }

  // Rest is base64-encoded zlib-compressed JSON
  const base64Data = trimmed.slice(1);

  try {
    // Decode base64 to binary
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decompress using pako
    // Factorio uses zlib format (with header), so we use inflate
    // Setting raw: false to handle zlib wrapper
    const decompressed = pako.inflate(bytes, { raw: false });
    const jsonString = new TextDecoder().decode(decompressed);
    const data: unknown = JSON.parse(jsonString);

    // Validate structure
    if (typeof data !== "object" || data === null) {
      throw new Error("Invalid blueprint: not an object");
    }

    const obj = data as Record<string, unknown>;

    if ("blueprint" in obj) {
      return { blueprint: obj.blueprint as Blueprint };
    } else if ("blueprint_book" in obj) {
      return { blueprint_book: obj.blueprint_book as BlueprintBook };
    } else {
      throw new Error(
        "Invalid blueprint: must contain 'blueprint' or 'blueprint_book'"
      );
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid blueprint: malformed JSON - ${error.message}`);
    }
    if (error instanceof Error && error.message.includes("incorrect header")) {
      throw new Error("Invalid blueprint: not valid zlib data");
    }
    throw error;
  }
}

/**
 * Encodes a blueprint object back to a Factorio blueprint string
 */
export function encodeBlueprint(data: BlueprintString): string {
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(jsonString);
  
  // Compress using pako
  const compressed = pako.deflate(bytes);
  
  // Encode to base64
  let binaryString = "";
  for (let i = 0; i < compressed.length; i++) {
    binaryString += String.fromCharCode(compressed[i]!);
  }
  const base64 = btoa(binaryString);
  
  // Add version byte
  return "0" + base64;
}

/**
 * Represents a tree structure for blueprint books that may contain nested books
 */
export interface BlueprintTreeNode {
  type: "blueprint" | "book";
  label: string;
  blueprint?: Blueprint;
  children?: BlueprintTreeNode[];
  index: number;
}

/**
 * Builds a tree structure from a blueprint string, handling nested books
 */
export function buildBlueprintTree(data: BlueprintString): BlueprintTreeNode[] {
  if (data.blueprint) {
    return [
      {
        type: "blueprint",
        label: data.blueprint.label || "Unnamed Blueprint",
        blueprint: data.blueprint,
        index: 0,
      },
    ];
  }

  if (data.blueprint_book) {
    return buildBookTree(data.blueprint_book);
  }

  return [];
}

function buildBookTree(book: BlueprintBook): BlueprintTreeNode[] {
  const nodes: BlueprintTreeNode[] = [];
  const sortedBlueprints = [...book.blueprints].sort((a, b) => a.index - b.index);
  
  for (const entry of sortedBlueprints) {
    if ("blueprint" in entry && entry.blueprint) {
      nodes.push({
        type: "blueprint",
        label: entry.blueprint.label || "Unnamed Blueprint",
        blueprint: entry.blueprint,
        index: entry.index,
      });
    } else if ("blueprint_book" in entry) {
      // Handle nested books
      const nestedBook = (entry as unknown as { blueprint_book: BlueprintBook; index: number }).blueprint_book;
      nodes.push({
        type: "book",
        label: nestedBook.label || "Unnamed Book",
        children: buildBookTree(nestedBook),
        index: entry.index,
      });
    }
  }
  
  return nodes;
}

/**
 * Extracts all blueprints from a blueprint string (handles both single and book)
 */
export function extractBlueprints(data: BlueprintString): Blueprint[] {
  if (data.blueprint) {
    return [data.blueprint];
  }

  if (data.blueprint_book) {
    return extractFromBook(data.blueprint_book);
  }

  return [];
}

function extractFromBook(book: BlueprintBook): Blueprint[] {
  const blueprints: Blueprint[] = [];
  const sortedBlueprints = [...book.blueprints].sort((a, b) => a.index - b.index);
  
  for (const entry of sortedBlueprints) {
    if ("blueprint" in entry && entry.blueprint) {
      blueprints.push(entry.blueprint);
    } else if ("blueprint_book" in entry) {
      // Handle nested books
      const nestedBook = (entry as unknown as { blueprint_book: BlueprintBook; index: number }).blueprint_book;
      blueprints.push(...extractFromBook(nestedBook));
    }
  }
  
  return blueprints;
}
