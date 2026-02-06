import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "../src/web-component";

describe("TruncatedValue Web Component", () => {
  const longValue = "0x1234567890abcdef1234567890abcdef12345678";
  const shortValue = "0x1234";
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  function createElement(attributes: Record<string, string | boolean> = {}) {
    const el = document.createElement("truncated-value");
    for (const [key, value] of Object.entries(attributes)) {
      if (typeof value === "boolean") {
        if (value) {
          el.setAttribute(key, "");
        }
      } else {
        el.setAttribute(key, value);
      }
    }
    container.appendChild(el);
    return el;
  }

  async function waitForUpdate(el: Element) {
    // Wait for Lit to update
    await (el as unknown as { updateComplete: Promise<boolean> })
      .updateComplete;
  }

  describe("registration", () => {
    it("registers the custom element", () => {
      const el = customElements.get("truncated-value");
      expect(el).toBeDefined();
    });

    it("can be created via document.createElement", () => {
      const el = document.createElement("truncated-value");
      expect(el).toBeInstanceOf(HTMLElement);
    });
  });

  describe("basic functionality", () => {
    it("renders with a value", async () => {
      const el = createElement({ value: longValue });
      await waitForUpdate(el);

      const shadow = el.shadowRoot;
      expect(shadow).not.toBeNull();
      expect(shadow?.textContent).toContain(longValue.slice(0, 6));
      expect(shadow?.textContent).toContain(longValue.slice(-4));
    });

    it("renders short values without truncation", async () => {
      const el = createElement({ value: shortValue });
      await waitForUpdate(el);

      // Remove whitespace to check text content
      const textContent = (el.shadowRoot?.textContent ?? "").replace(
        /\s+/g,
        ""
      );
      expect(textContent).toContain(shortValue);
    });

    it("respects custom start-length and end-length", async () => {
      const el = createElement({
        value: longValue,
        "start-length": "8",
        "end-length": "6",
      });
      await waitForUpdate(el);

      const shadow = el.shadowRoot;
      expect(shadow?.textContent).toContain(longValue.slice(0, 8));
      expect(shadow?.textContent).toContain(longValue.slice(-6));
    });

    it("respects custom ellipsis attribute", async () => {
      const el = createElement({
        value: longValue,
        ellipsis: "[more]",
      });
      await waitForUpdate(el);

      const ellipsis = el.shadowRoot?.querySelector(".tv-ellipsis");
      expect(ellipsis?.getAttribute("data-ellipsis")).toBe("[more]");
    });
  });

  describe("expandable attribute", () => {
    it("sets tabindex=0 when expandable", async () => {
      const el = createElement({ value: longValue, expandable: true });
      await waitForUpdate(el);

      const focusable = el.shadowRoot?.querySelector('[tabindex="0"]');
      expect(focusable).not.toBeNull();
    });

    it("sets tabindex=-1 when not expandable", async () => {
      const el = createElement({ value: longValue });
      await waitForUpdate(el);

      const nonFocusable = el.shadowRoot?.querySelector('[tabindex="-1"]');
      expect(nonFocusable).not.toBeNull();
    });
  });

  describe("reactivity", () => {
    it("updates when value attribute changes", async () => {
      const el = createElement({ value: shortValue });
      await waitForUpdate(el);

      // Remove whitespace to check text content
      const textContent = (el.shadowRoot?.textContent ?? "").replace(
        /\s+/g,
        ""
      );
      expect(textContent).toContain(shortValue);

      el.setAttribute("value", longValue);
      await waitForUpdate(el);

      expect(el.shadowRoot?.textContent).toContain(longValue.slice(0, 6));
    });

    it("updates when start-length changes", async () => {
      const el = createElement({ value: longValue, "start-length": "4" });
      await waitForUpdate(el);

      expect(el.shadowRoot?.textContent).toContain(longValue.slice(0, 4));

      el.setAttribute("start-length", "10");
      await waitForUpdate(el);

      expect(el.shadowRoot?.textContent).toContain(longValue.slice(0, 10));
    });

    it("updates when ellipsis changes", async () => {
      const el = createElement({ value: longValue, ellipsis: "..." });
      await waitForUpdate(el);

      const initialEllipsis = el.shadowRoot?.querySelector(".tv-ellipsis");
      expect(initialEllipsis?.getAttribute("data-ellipsis")).toBe("...");

      el.setAttribute("ellipsis", "<more>");
      await waitForUpdate(el);

      const updatedEllipsis = el.shadowRoot?.querySelector(".tv-ellipsis");
      expect(updatedEllipsis?.getAttribute("data-ellipsis")).toBe("<more>");
    });
  });

  describe("shadow DOM parts", () => {
    it("exposes container part", async () => {
      const el = createElement({ value: longValue });
      await waitForUpdate(el);

      const part = el.shadowRoot?.querySelector('[part="container"]');
      expect(part).not.toBeNull();
    });

    it("exposes start part", async () => {
      const el = createElement({ value: longValue });
      await waitForUpdate(el);

      const part = el.shadowRoot?.querySelector('[part="start"]');
      expect(part).not.toBeNull();
    });

    it("exposes middle part", async () => {
      const el = createElement({ value: longValue });
      await waitForUpdate(el);

      const part = el.shadowRoot?.querySelector('[part="middle"]');
      expect(part).not.toBeNull();
    });

    it("exposes end part", async () => {
      const el = createElement({ value: longValue });
      await waitForUpdate(el);

      const part = el.shadowRoot?.querySelector('[part="end"]');
      expect(part).not.toBeNull();
    });
  });

  describe("accessibility", () => {
    it("has aria-hidden on ellipsis element", async () => {
      const el = createElement({ value: longValue });
      await waitForUpdate(el);

      const hidden = el.shadowRoot?.querySelector('[aria-hidden="true"]');
      expect(hidden).not.toBeNull();
    });

    it("has correct data-is-truncated attribute", async () => {
      const el = createElement({ value: longValue });
      await waitForUpdate(el);

      const visual = el.shadowRoot?.querySelector(".truncated-value");
      expect(visual?.getAttribute("data-is-truncated")).toBe("true");
    });

    it("sets data-is-truncated=false for short values", async () => {
      const el = createElement({ value: shortValue });
      await waitForUpdate(el);

      const visual = el.shadowRoot?.querySelector(".truncated-value");
      expect(visual?.getAttribute("data-is-truncated")).toBe("false");
    });
  });
});
