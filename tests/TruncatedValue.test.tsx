import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { TruncatedValue } from "../src/TruncatedValue";
import { getSearchableText } from "./helpers";

describe("TruncatedValue React component", () => {
  const longValue = "0x1234567890abcdef1234567890abcdef12345678";
  const shortValue = "0x1234";

  describe("basic functionality", () => {
    it("renders the full value when string is short", () => {
      const { container } = render(<TruncatedValue value={shortValue} />);

      expect(container.textContent).toContain(shortValue.slice(0, 2));
      expect(container.textContent).toContain(shortValue.slice(-2));
    });

    it("renders truncated value when string is long", () => {
      const { container } = render(<TruncatedValue value={longValue} />);

      expect(container.textContent).toContain(longValue.slice(0, 6));
      expect(container.textContent).toContain(longValue.slice(-4));
    });

    it("respects custom startLength and endLength props", () => {
      const customStartLength = 8;
      const customEndLength = 6;

      const { container } = render(
        <TruncatedValue
          value={longValue}
          startLength={customStartLength}
          endLength={customEndLength}
        />
      );

      expect(container.textContent).toContain(
        longValue.slice(0, customStartLength)
      );
      expect(container.textContent).toContain(
        longValue.slice(-customEndLength)
      );
    });

    it("handles empty value gracefully", () => {
      const { container } = render(<TruncatedValue value="" />);
      expect(container).toBeInTheDocument();
    });

    it("handles undefined value gracefully", () => {
      const { container } = render(<TruncatedValue />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("expandable prop functionality", () => {
    it("is focusable when expandable is true", () => {
      const { container } = render(
        <TruncatedValue value={longValue} expandable={true} />
      );

      const focusableElement = container.querySelector('[tabindex="0"]');
      expect(focusableElement).toBeInTheDocument();
    });

    it("is not focusable when expandable is false (default)", () => {
      const { container } = render(
        <TruncatedValue value={longValue} expandable={false} />
      );

      const focusableElement = container.querySelector('[tabindex="-1"]');
      expect(focusableElement).toBeInTheDocument();

      const expandableElement = container.querySelector('[tabindex="0"]');
      expect(expandableElement).not.toBeInTheDocument();
    });

    it("applies correct data attributes for truncated state", () => {
      const { container } = render(
        <TruncatedValue value={longValue} expandable={true} />
      );

      const mainElement = container.querySelector(".truncated-value");
      expect(mainElement).toHaveAttribute("data-is-truncated", "true");
    });
  });

  describe("focus and interaction behavior", () => {
    it("can receive focus when expandable", () => {
      const { container } = render(
        <TruncatedValue value={longValue} expandable={true} />
      );

      const focusableElement =
        container.querySelector<HTMLElement>('[tabindex="0"]');

      expect(focusableElement).not.toBeNull();
      focusableElement?.focus();
      expect(focusableElement).toHaveFocus();
    });
  });

  describe("CSS structure and classes", () => {
    it("renders with correct CSS classes", () => {
      const { container } = render(<TruncatedValue value={longValue} />);

      const truncatedElement = container.querySelector(".truncated-value");
      expect(truncatedElement).toBeInTheDocument();
    });

    it("includes inline styles for truncation behavior", () => {
      const { container } = render(<TruncatedValue value={longValue} />);

      const styleElement = container.querySelector("style");
      expect(styleElement).toBeInTheDocument();
      expect(styleElement?.textContent).toContain("truncated-value");
    });

    it("applies custom className to the interactive element", () => {
      const { container } = render(
        <TruncatedValue value={longValue} className="custom-class" />
      );

      const element = container.querySelector(".truncated-value");
      expect(element).toHaveClass("custom-class");
    });
  });

  describe("text content and searchability", () => {
    it("preserves full text content for searchability", () => {
      const { container } = render(<TruncatedValue value={longValue} />);

      expect(container.textContent).toContain(longValue.slice(0, 6));
      expect(container.textContent).toContain(longValue.slice(-4));
    });

    it("renders ellipsis indicator in middle section", () => {
      const { container } = render(<TruncatedValue value={longValue} />);

      const hiddenSpan = container.querySelector('[aria-hidden="true"]');
      expect(hiddenSpan).toBeInTheDocument();
    });

    it("makes the full text searchable via browser find functionality", () => {
      const { container } = render(<TruncatedValue value={longValue} />);

      const searchableText = getSearchableText(container);

      // Verify the complete value is searchable
      expect(searchableText).toContain(longValue);

      // Test that specific parts from middle are findable
      const middlePart = longValue.slice(10, 20);
      expect(searchableText).toContain(middlePart);
    });
  });

  describe("edge cases and length calculations", () => {
    it("handles strings shorter than requested lengths", () => {
      const veryShortValue = "0x12";
      const { container } = render(
        <TruncatedValue
          value={veryShortValue}
          startLength={10}
          endLength={10}
        />
      );

      expect(container.textContent).toContain(veryShortValue);
    });

    it("handles zero length values", () => {
      const { container } = render(
        <TruncatedValue value={longValue} startLength={0} endLength={0} />
      );

      expect(container).toBeInTheDocument();
    });

    it("handles very large length values", () => {
      const { container } = render(
        <TruncatedValue value={longValue} startLength={1000} endLength={1000} />
      );

      expect(container.textContent).toContain(longValue);
    });
  });

  describe("accessibility", () => {
    it("has proper tabindex for keyboard navigation", () => {
      const { container } = render(
        <TruncatedValue value={longValue} expandable={true} />
      );

      const focusableElement = container.querySelector('[tabindex="0"]');
      expect(focusableElement).toBeInTheDocument();
    });

    it("sets tabindex=-1 when not expandable", () => {
      const { container } = render(
        <TruncatedValue value={longValue} expandable={false} />
      );

      const nonFocusableElement = container.querySelector('[tabindex="-1"]');
      expect(nonFocusableElement).toBeInTheDocument();
    });

    it("includes aria-hidden for decorative elements", () => {
      const { container } = render(<TruncatedValue value={longValue} />);

      const hiddenElement = container.querySelector('[aria-hidden="true"]');
      expect(hiddenElement).toBeInTheDocument();
    });
  });
});
