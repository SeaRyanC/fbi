/**
 * Factorio Blueprint Decoder
 * Decodes base64+zlib compressed blueprint strings
 */

import { inflateSync } from "node:zlib";
import type { BlueprintString, Blueprint, BlueprintBook } from "./types.js";

/**
 * Decodes a Factorio blueprint string
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
    const compressed = Buffer.from(base64Data, "base64");
    const decompressed = inflateSync(compressed);
    const jsonString = decompressed.toString("utf8");
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
 * Extracts all blueprints from a blueprint string (handles both single and book)
 */
export function extractBlueprints(data: BlueprintString): Blueprint[] {
  if (data.blueprint) {
    return [data.blueprint];
  }

  if (data.blueprint_book) {
    return data.blueprint_book.blueprints
      .sort((a, b) => a.index - b.index)
      .map((entry) => entry.blueprint);
  }

  return [];
}
