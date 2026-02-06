import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/e2e/fixtures/index.html");
    // Wait for web component to be defined
    await page.waitForFunction(
      () => customElements.get("truncated-value") !== undefined
    );
  });

  test("component is keyboard focusable", async ({ page }) => {
    // Focus the "Before" button first
    await page.locator("#before-focus").focus();

    // Tab to the truncated-value component
    await page.keyboard.press("Tab");

    // Check that the truncated-value is now focused
    const focusInfo = await page.evaluate(() => {
      const host = document.activeElement as HTMLElement | null;
      const shadowActive =
        host && "shadowRoot" in host ? host.shadowRoot?.activeElement : null;
      return {
        hostId: host?.id ?? null,
        shadowHasFocus:
          shadowActive?.classList.contains("truncated-value") ?? false,
      };
    });

    expect(focusInfo.hostId).toBe("focus-value");
    expect(focusInfo.shadowHasFocus).toBe(true);
  });

  test("focus expands the component (CSS-based)", async ({ page }) => {
    const truncatedValue = page.locator("#keyboard-value");

    // Verify it's truncated when not focused
    const isTruncatedValue = await truncatedValue.evaluate((el) => {
      const container = el.shadowRoot?.querySelector(".truncated-value");
      if (!container) return null;
      return getComputedStyle(container).getPropertyValue("--isTruncated");
    });
    expect(isTruncatedValue?.trim()).toBe("1");

    // Focus the inner container (the element with tabindex in shadow DOM)
    await truncatedValue.evaluate((el) => {
      const container = el.shadowRoot?.querySelector(
        ".truncated-value"
      ) as HTMLElement | null;
      container?.focus();
    });
    // Verify it's now expanded (CSS-based expansion via :focus-within)
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

  test("blur collapses the component", async ({ page }) => {
    const truncatedValue = page.locator("#expansion-value");

    // Focus the inner container to expand
    await truncatedValue.evaluate((el) => {
      const container = el.shadowRoot?.querySelector(
        ".truncated-value"
      ) as HTMLElement | null;
      container?.focus();
    });
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

    // Click elsewhere to blur
    await page.locator("body").click();

    // Verify it's now collapsed
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

  test("component has appropriate tabindex for accessibility", async ({
    page,
  }) => {
    const truncatedValue = page.locator("#keyboard-value");

    // Check for accessibility attributes in shadow DOM
    const tabindex = await truncatedValue.evaluate((el) => {
      const container = el.shadowRoot?.querySelector(".truncated-value");
      return container?.getAttribute("tabindex");
    });

    // Expandable components should have tabindex="0"
    expect(tabindex).toBe("0");
  });

  test("non-expandable component has tabindex -1", async ({ page }) => {
    // Add a non-expandable test value dynamically
    await page.evaluate(() => {
      const el = document.createElement("truncated-value");
      el.id = "non-expandable-value";
      el.setAttribute("value", "0x1234567890abcdef");
      el.setAttribute("start-length", "4");
      el.setAttribute("end-length", "4");
      // NOT setting expandable attribute
      document.body.appendChild(el);
    });

    await page.waitForTimeout(100);

    const truncatedValue = page.locator("#non-expandable-value");
    const tabindex = await truncatedValue.evaluate((el) => {
      const container = el.shadowRoot?.querySelector(".truncated-value");
      return container?.getAttribute("tabindex");
    });

    // Non-expandable components should have tabindex="-1"
    expect(tabindex).toBe("-1");
  });

  test("component shows focus indicator on keyboard navigation", async ({
    page,
  }) => {
    // Focus using keyboard (tab from previous element)
    await page.locator("#before-focus").focus();
    await page.keyboard.press("Tab");

    // Check that focus is on the truncated-value
    const isFocused = await page.evaluate(() => {
      return document.activeElement?.id === "focus-value";
    });

    expect(isFocused).toBe(true);
  });

  test("active state expands component temporarily", async ({ page }) => {
    const containerHandle = await page
      .locator("#expansion-value")
      .evaluateHandle((el) => el.shadowRoot?.querySelector(".truncated-value"));
    const container = containerHandle.asElement();
    if (!container) {
      throw new Error("Missing shadow container for active-state test");
    }

    const box = await container.boundingBox();
    if (!box) throw new Error("Missing bounding box for active-state test");

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();

    await expect
      .poll(async () => {
        return page.locator("#expansion-value").evaluate((el) => {
          const target = el.shadowRoot?.querySelector(".truncated-value");
          if (!target) return null;
          return getComputedStyle(target)
            .getPropertyValue("--isTruncated")
            .trim();
        });
      })
      .toBe("0");

    await page.mouse.up();

    // Blur so :focus-within doesn't keep it expanded
    await page.locator("body").click();

    await expect
      .poll(async () => {
        return page.locator("#expansion-value").evaluate((el) => {
          const target = el.shadowRoot?.querySelector(".truncated-value");
          if (!target) return null;
          return getComputedStyle(target)
            .getPropertyValue("--isTruncated")
            .trim();
        });
      })
      .toBe("1");
  });
});
