/**
 * Simulates browser find functionality (Ctrl+F) by walking through all text nodes
 * in the DOM. This is useful for testing TruncatedValue components where the complete
 * text is preserved for searchability even when visually truncated.
 *
 * @param container - The container to search within (defaults to document.body)
 * @returns The concatenated text content that would be searchable by browser find
 */
export function getSearchableText(container: Element = document.body): string {
  // Extract text from all elements except style and script
  function extractText(element: Element): string {
    const textParts: string[] = [];

    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        textParts.push(node.textContent ?? "");
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const tagName = el.tagName.toUpperCase();
        if (tagName !== "STYLE" && tagName !== "SCRIPT") {
          textParts.push(extractText(el));
        }
      }
    }

    return textParts.join("");
  }

  return extractText(container);
}
