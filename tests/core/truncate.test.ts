import { describe, it, expect } from "vitest";
import { truncate } from "../../src/core";

describe("truncate", () => {
  const longValue = "0x1234567890abcdef1234567890abcdef12345678";
  const shortValue = "0x1234";

  describe("basic functionality", () => {
    it("truncates long values correctly", () => {
      const result = truncate({ value: longValue });

      expect(result.start).toBe("0x1234");
      expect(result.end).toBe("5678");
      expect(result.isTruncated).toBe(true);
      expect(result.start + result.middle + result.end).toBe(longValue);
    });

    it("does not truncate short values", () => {
      const result = truncate({ value: shortValue });

      expect(result.isTruncated).toBe(false);
      expect(result.start + result.middle + result.end).toBe(shortValue);
    });

    it("respects custom startLength and endLength", () => {
      const result = truncate({
        value: longValue,
        startLength: 8,
        endLength: 6,
      });

      expect(result.start).toBe("0x123456");
      expect(result.end).toBe("345678");
      expect(result.isTruncated).toBe(true);
    });

    it("handles empty string", () => {
      const result = truncate({ value: "" });

      expect(result.start).toBe("");
      expect(result.middle).toBe("");
      expect(result.end).toBe("");
      expect(result.isTruncated).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("handles strings shorter than requested lengths", () => {
      const veryShortValue = "0x12";
      const result = truncate({
        value: veryShortValue,
        startLength: 10,
        endLength: 10,
      });

      // Should not crash and preserve the full value
      expect(result.start + result.middle + result.end).toBe(veryShortValue);
      expect(result.isTruncated).toBe(false);
    });

    it("adjusts lengths proportionally when string is too short", () => {
      const value = "0x123456"; // 8 characters
      const result = truncate({
        value,
        startLength: 6,
        endLength: 6, // Total 12 > 8
      });

      // Should preserve the full value
      expect(result.start + result.middle + result.end).toBe(value);
    });

    it("handles zero length values", () => {
      const result = truncate({
        value: longValue,
        startLength: 0,
        endLength: 0,
      });

      expect(result.start).toBe("");
      expect(result.end).toBe("");
      expect(result.middle).toBe(longValue);
    });

    it("handles very large length values", () => {
      const result = truncate({
        value: longValue,
        startLength: 1000,
        endLength: 1000,
      });

      expect(result.start + result.middle + result.end).toBe(longValue);
      expect(result.isTruncated).toBe(false);
    });

    it("handles equal start and end lengths", () => {
      const result = truncate({
        value: "abcdefghij",
        startLength: 3,
        endLength: 3,
      });

      expect(result.start).toBe("abc");
      expect(result.end).toBe("hij");
      expect(result.middle).toBe("defg");
      expect(result.isTruncated).toBe(true);
    });

    it("handles asymmetric lengths", () => {
      const result = truncate({
        value: "abcdefghij",
        startLength: 2,
        endLength: 5,
      });

      expect(result.start).toBe("ab");
      expect(result.end).toBe("fghij");
      expect(result.middle).toBe("cde");
      expect(result.isTruncated).toBe(true);
    });

    it("handles exact length match (no truncation needed)", () => {
      const value = "abcdefghij"; // 10 characters
      const result = truncate({
        value,
        startLength: 5,
        endLength: 5,
      });

      expect(result.isTruncated).toBe(false);
      expect(result.start + result.middle + result.end).toBe(value);
    });
  });

  describe("reconstructs from parts", () => {
    it("reconstructs the original from parts", () => {
      const values = [
        "0x1234567890abcdef",
        "hello world",
        "a",
        "",
        "ab",
        "very-long-string-that-should-be-truncated-properly",
      ];

      for (const value of values) {
        const result = truncate({ value, startLength: 6, endLength: 4 });
        expect(result.start + result.middle + result.end).toBe(value);
      }
    });
  });
});
