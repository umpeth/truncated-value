import * as React from "react";
import { truncate, styles, type TruncatedValueBaseProps } from "./core";

/**
 * Props for the TruncatedValue React component
 */
export interface TruncatedValueProps extends TruncatedValueBaseProps {
  /** Additional CSS class name applied to the interactive element */
  className?: string;
  /** Inline styles applied to the component */
  style?: React.CSSProperties;
}

/**
 * A component that intelligently truncates long string values, displaying the start and end
 * while hiding the middle portion. Features interactive focus states that reveal the full value.
 * The complete text remains searchable via browser find functionality even when truncated.
 *
 * Commonly used for displaying addresses, hashes, or other long identifiers where the beginning
 * and end are most important for identification.
 *
 * @example
 * ```tsx
 * <TruncatedValue
 *   value="0x1234567890abcdef1234567890abcdef12345678"
 *   startLength={8}
 *   endLength={6}
 *   expandable
 * />
 * // Displays: 0x123456...345678 (expandable on focus)
 *
 * <TruncatedValue
 *   value="0x1234567890abcdef1234567890abcdef12345678"
 *   expandable={false}
 * />
 * // Displays: 0x1234...5678 (always truncated)
 * // Full text remains searchable with Ctrl+F/Cmd+F
 * ```
 */
export const TruncatedValue: React.FC<TruncatedValueProps> = ({
  value = "",
  startLength = 6,
  endLength = 4,
  ellipsis = "...",
  expandable = false,
  className,
  style,
}) => {
  const { start, middle, end, isTruncated } = truncate({
    value,
    startLength,
    endLength,
  });
  const middleFirstHalf = middle.slice(0, middle.length / 2);
  const middleSecondHalf = middle.slice(middle.length / 2);

  return (
    <>
      <style>{styles}</style>
      <span
        data-is-truncated={isTruncated}
        tabIndex={expandable ? 0 : -1}
        className={`truncated-value${className ? ` ${className}` : ""}`}
        style={style}
      >
        <span>{start}</span>
        <span className="tv-middle">
          <span className="tv-middle-text">{middleFirstHalf}</span>
          <span
            className="tv-ellipsis"
            aria-hidden="true"
            data-ellipsis={ellipsis}
          ></span>
          <span className="tv-middle-text">{middleSecondHalf}</span>
        </span>
        <span>{end}</span>
      </span>
    </>
  );
};
