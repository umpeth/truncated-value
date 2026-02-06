import type { TruncateOptions, TruncateResult } from "./types";

/**
 * Truncates a string value intelligently, preserving the start and end portions.
 *
 * The function handles edge cases like:
 * - Strings shorter than the requested lengths (adjusts proportionally)
 * - Zero or very large length values
 * - Empty strings
 *
 * @example
 * ```ts
 * const result = truncate({
 *   value: "0x1234567890abcdef1234567890abcdef12345678",
 *   startLength: 6,
 *   endLength: 4
 * });
 * // result.start = "0x1234"
 * // result.middle = "567890abcdef1234567890abcdef1234"
 * // result.end = "5678"
 * // result.isTruncated = true
 * ```
 */
export function truncate(options: TruncateOptions): TruncateResult {
  const { value, startLength = 6, endLength = 4 } = options;

  // Handle empty or undefined values
  if (!value) {
    return {
      start: "",
      middle: "",
      end: "",
      isTruncated: false,
    };
  }

  // Determine if truncation is needed
  const isTruncated = startLength + endLength < value.length;

  // Calculate excess characters when string is shorter than requested lengths
  const excess = Math.max(0, startLength + endLength - value.length);

  // Adjust lengths proportionally when string is too short
  const adjustedStartLength =
    startLength -
    (startLength > endLength ? Math.ceil : Math.floor)(excess / 2);
  const adjustedEndLength =
    endLength - (startLength > endLength ? Math.floor : Math.ceil)(excess / 2);

  // Ensure we don't get negative lengths
  const safeStartLength = Math.max(
    0,
    Math.min(adjustedStartLength, value.length)
  );
  const safeEndLength = Math.max(
    0,
    Math.min(adjustedEndLength, value.length - safeStartLength)
  );

  // Split the value into start, middle, and end segments
  const start = value.slice(0, safeStartLength);
  const end = safeEndLength > 0 ? value.slice(-safeEndLength) : "";
  const middle = value.slice(
    safeStartLength,
    safeEndLength > 0 ? -safeEndLength : value.length
  );

  return {
    start,
    middle,
    end,
    isTruncated,
  };
}
