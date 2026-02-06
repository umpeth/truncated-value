/**
 * CSS styles for the TruncatedValue component.
 *
 * How it works:
 * - `--isTruncated` CSS variable (0=expanded, 1=truncated) represents state
 * - Visual default is truncated; expands on :active or :focus-within
 * - Short values (data-is-truncated="false") stay expanded
 * - Non-expandable (tabindex="-1") stays truncated unless value is short
 * - Middle text: font-size set to 0 when truncated (hidden but searchable)
 * - Ellipsis: decorative span uses `data-ellipsis` via ::after content
 */
export const styles = `
[tabindex].truncated-value { --isTruncated: 0; }
[tabindex].truncated-value:not(:is(:active, :focus-within, [data-is-truncated="false"])) { --isTruncated: 1; cursor: zoom-in; }
[tabindex="-1"].truncated-value:not([data-is-truncated="false"]) { --isTruncated: 1 !important; cursor: default !important; }
[tabindex].truncated-value > .tv-middle > .tv-middle-text { font-size: calc((1 - var(--isTruncated)) * 1em); }
[tabindex].truncated-value > .tv-middle > .tv-ellipsis { font-size: calc(var(--isTruncated) * 1em); pointer-events: none; }
[tabindex].truncated-value > .tv-middle > .tv-ellipsis::after { content: attr(data-ellipsis); }
`;
