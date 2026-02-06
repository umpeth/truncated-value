import { test, expect } from "@playwright/test";

test.describe("Browser Find (Ctrl+F) Searchability", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/e2e/fixtures/index.html");
    // Wait for web component to be defined
    await page.waitForFunction(
      () => customElements.get("truncated-value") !== undefined
    );
  });

  test("hidden middle text is present in DOM and searchable", async ({
    page,
  }) => {
    const truncatedValue = page.locator("#searchable-value");
    await expect(truncatedValue).toBeVisible();

    // Full value should be in DOM text content (searchable even if visually hidden)
    await expect(truncatedValue).toContainText("HIDDEN_MIDDLE_TEXT");
  });

  test("browser find can locate text in truncated middle portion", async ({
    page,
  }) => {
    // Approximate Ctrl+F by walking the composed tree and skipping aria-hidden
    const composedText = await page.evaluate(() => {
      const isHidden = (el: Element) => {
        const style = getComputedStyle(el);
        return style.display === "none" || style.visibility === "hidden";
      };

      const collectText = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent ?? "";
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return "";
        const el = node as Element;

        if (el.getAttribute("aria-hidden") === "true") return "";
        if (isHidden(el)) return "";

        let text = "";

        // Traverse shadow root if present (open shadow DOM)
        const shadow = (el as HTMLElement).shadowRoot;
        if (shadow) {
          shadow.childNodes.forEach((child) => {
            text += collectText(child);
          });
        }

        // Traverse light DOM / slot assigned nodes
        if (el instanceof HTMLSlotElement) {
          el.assignedNodes({ flatten: true }).forEach((child) => {
            text += collectText(child);
          });
        } else {
          el.childNodes.forEach((child) => {
            text += collectText(child);
          });
        }

        return text;
      };

      return collectText(document.body);
    });

    expect(composedText).toContain("HIDDEN_MIDDLE_TEXT");
  });

  test("truncated value displays start and end portions visually", async ({
    page,
  }) => {
    const truncatedValue = page.locator("#searchable-value");

    // Check that the shadow root container is rendered
    const hasContainer = await truncatedValue.evaluate((el) => {
      return el.shadowRoot?.querySelector(".truncated-value") !== null;
    });
    expect(hasContainer).toBe(true);

    // Verify the value attribute is correct
    const value = await truncatedValue.getAttribute("value");
    expect(value).toBe("0xSTART_HIDDEN_MIDDLE_TEXT_END123");
  });

  test("expanded state shows full text when focused", async ({ page }) => {
    const truncatedValue = page.locator("#searchable-value");

    // Focus the inner container (CSS-based expansion via :focus-within)
    await truncatedValue.evaluate((el) => {
      const container = el.shadowRoot?.querySelector(
        ".truncated-value"
      ) as HTMLElement | null;
      container?.focus();
    });

    // When focused, --isTruncated should be 0 (expanded)
    await expect
      .poll(async () => {
        return truncatedValue.evaluate((el) => {
          const container = el.shadowRoot?.querySelector(".truncated-value");
          if (!container) return null;
          return getComputedStyle(container)
            .getPropertyValue("--isTruncated")
            .trim();
        });
      })
      .toBe("0");
  });

  test("component is truncated when not focused", async ({ page }) => {
    const truncatedValue = page.locator("#searchable-value");

    // Blur to ensure not focused
    await page.locator("body").click();

    // When not focused, --isTruncated should be 1 (truncated)
    await expect
      .poll(async () => {
        return truncatedValue.evaluate((el) => {
          const container = el.shadowRoot?.querySelector(".truncated-value");
          if (!container) return null;
          return getComputedStyle(container)
            .getPropertyValue("--isTruncated")
            .trim();
        });
      })
      .toBe("1");
  });
});
