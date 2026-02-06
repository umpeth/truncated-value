/**
 * Options for the truncate function
 */
export interface TruncateOptions {
  /** The string value to truncate */
  value: string;
  /** Number of characters to show at the start (default: 6) */
  startLength?: number;
  /** Number of characters to show at the end (default: 4) */
  endLength?: number;
}

/**
 * Result of the truncate function
 */
export interface TruncateResult {
  /** Characters at the start of the value */
  start: string;
  /** Characters in the middle (hidden when truncated) */
  middle: string;
  /** Characters at the end of the value */
  end: string;
  /** Whether the value was truncated */
  isTruncated: boolean;
}

/**
 * Props shared between React and Web Component implementations
 */
export interface TruncatedValueBaseProps {
  /** The string value to display and potentially truncate */
  value?: string;
  /** Number of characters to show at the start when truncated (default: 6) */
  startLength?: number;
  /** Number of characters to show at the end when truncated (default: 4) */
  endLength?: number;
  /** Whether the component should expand on focus/click (default: false) */
  expandable?: boolean;
}
