import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { TruncatedValue } from "../src/TruncatedValue";
import { styles } from "../src/core";
import "../src/web-component";
import { getSearchableText } from "./helpers";

/**
 * Drift Prevention Tests
 *
 * Ensures React and Web Component implementations produce identical
 * output for the same inputs. Catches implementation drift.
 */
describe("drift prevention: React and Web Component parity", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  async function renderWebComponent(props: {
    value: string;
    startLength?: number;
    endLength?: number;
    expandable?: boolean;
  }) {
    const el = document.createElement("truncated-value");
    el.setAttribute("value", props.value);
    if (props.startLength !== undefined)
      el.setAttribute("start-length", String(props.startLength));
    if (props.endLength !== undefined)
      el.setAttribute("end-length", String(props.endLength));
    if (props.expandable) el.setAttribute("expandable", "");
    container.appendChild(el);
    await (el as unknown as { updateComplete: Promise<boolean> })
      .updateComplete;
    return el;
  }

  function getWebComponentText(el: Element): string {
    const inner = el.shadowRoot?.querySelector(".truncated-value");
    return inner ? getSearchableText(inner) : "";
  }

  function hasWebComponentStyles(el: Element): boolean {
    const root = el.shadowRoot;
    if (!root) return false;
    const styleTags = Array.from(root.querySelectorAll("style"));
    if (
      styleTags.some((styleTag) =>
        styleTag.textContent.includes("truncated-value")
      )
    )
      return true;
    const adopted = (
      root as unknown as { adoptedStyleSheets?: CSSStyleSheet[] }
    ).adoptedStyleSheets;
    if (!adopted || adopted.length === 0) return false;
    return adopted.some((sheet) => {
      try {
        return Array.from(sheet.cssRules).some((rule) =>
          rule.cssText.includes("truncated-value")
        );
      } catch {
        return false;
      }
    });
  }

  const testCases = [
    { name: "long value", value: "0x1234567890abcdef1234567890abcdef12345678" },
    { name: "short value", value: "0x1234" },
    { name: "empty", value: "" },
    { name: "single char", value: "a" },
    {
      name: "exact boundary",
      value: "abcdefghij",
      startLength: 5,
      endLength: 5,
    },
    {
      name: "custom lengths",
      value: "0x1234567890abcdef",
      startLength: 8,
      endLength: 6,
    },
    {
      name: "asymmetric",
      value: "abcdefghijklmnopqrstuvwxyz",
      startLength: 3,
      endLength: 10,
    },
  ];

  describe("searchable text parity", () => {
    for (const tc of testCases) {
      it(`identical text: ${tc.name}`, async () => {
        const { container: reactContainer } = render(
          <TruncatedValue
            value={tc.value}
            startLength={tc.startLength}
            endLength={tc.endLength}
          />
        );
        const reactEl = reactContainer.querySelector(".truncated-value");
        const reactText = reactEl ? getSearchableText(reactEl) : "";

        const webEl = await renderWebComponent(tc);
        const webText = getWebComponentText(webEl);

        expect(reactText).toBe(webText);
        expect(reactText).toBe(tc.value);
        expect(webText).toBe(tc.value);
      });
    }
  });

  describe("style parity", () => {
    it("React injects shared styles", () => {
      const { container: reactContainer } = render(
        <TruncatedValue value="test-value" />
      );
      const styleTag = reactContainer.querySelector("style");
      expect(styleTag).toBeInTheDocument();
      expect(styleTag?.textContent).toBe(styles);
    });

    it("Web component applies shared styles", async () => {
      const webEl = await renderWebComponent({ value: "test-value" });
      expect(hasWebComponentStyles(webEl)).toBe(true);
    });
  });

  describe("data-is-truncated parity", () => {
    for (const tc of testCases) {
      it(`same truncation state: ${tc.name}`, async () => {
        const { container: reactContainer } = render(
          <TruncatedValue
            value={tc.value}
            startLength={tc.startLength}
            endLength={tc.endLength}
          />
        );
        const reactAttr = reactContainer
          .querySelector(".truncated-value")
          ?.getAttribute("data-is-truncated");

        const webEl = await renderWebComponent(tc);
        const webAttr = webEl.shadowRoot
          ?.querySelector(".truncated-value")
          ?.getAttribute("data-is-truncated");

        expect(reactAttr).toBe(webAttr);
      });
    }
  });

  describe("structure parity", () => {
    it("both use the same middle span structure", async () => {
      const { container: reactContainer } = render(
        <TruncatedValue value="0x1234567890abcdef" />
      );
      const reactMiddle = reactContainer.querySelector(".tv-middle");
      const reactSpans = reactMiddle?.querySelectorAll("span");

      const webEl = await renderWebComponent({ value: "0x1234567890abcdef" });
      const webMiddle = webEl.shadowRoot?.querySelector(".tv-middle");
      const webSpans = webMiddle?.querySelectorAll("span");

      expect(reactSpans?.length).toBe(3);
      expect(webSpans?.length).toBe(3);
      expect(reactSpans?.[1]?.getAttribute("aria-hidden")).toBe("true");
      expect(webSpans?.[1]?.getAttribute("aria-hidden")).toBe("true");
    });
  });

  describe("tabindex parity", () => {
    it("both use tabindex=0 when expandable", async () => {
      const { container: reactContainer } = render(
        <TruncatedValue value="test-value" expandable />
      );
      const webEl = await renderWebComponent({
        value: "test-value",
        expandable: true,
      });

      expect(
        reactContainer.querySelector('[tabindex="0"]')
      ).toBeInTheDocument();
      expect(webEl.shadowRoot?.querySelector('[tabindex="0"]')).not.toBeNull();
    });

    it("both use tabindex=-1 when not expandable", async () => {
      const { container: reactContainer } = render(
        <TruncatedValue value="test-value" expandable={false} />
      );
      const webEl = await renderWebComponent({
        value: "test-value",
        expandable: false,
      });

      expect(
        reactContainer.querySelector('[tabindex="-1"]')
      ).toBeInTheDocument();
      expect(webEl.shadowRoot?.querySelector('[tabindex="-1"]')).not.toBeNull();
    });
  });

  describe("aria-hidden ellipsis parity", () => {
    it("both have aria-hidden on ellipsis element", async () => {
      const { container: reactContainer } = render(
        <TruncatedValue value="0x1234567890abcdef" />
      );
      const webEl = await renderWebComponent({ value: "0x1234567890abcdef" });

      expect(
        reactContainer.querySelector('[aria-hidden="true"]')
      ).toBeInTheDocument();
      expect(
        webEl.shadowRoot?.querySelector('[aria-hidden="true"]')
      ).not.toBeNull();
    });
  });

  describe("web component parts", () => {
    it("exposes expected parts", async () => {
      const webEl = await renderWebComponent({ value: "0x1234567890abcdef" });
      const root = webEl.shadowRoot;

      expect(root?.querySelector('[part="container"]')).not.toBeNull();
      expect(root?.querySelector('[part="start"]')).not.toBeNull();
      expect(root?.querySelector('[part="middle"]')).not.toBeNull();
      expect(root?.querySelector('[part="end"]')).not.toBeNull();
    });
  });
});
