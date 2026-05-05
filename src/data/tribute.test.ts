import { describe, expect, it } from "vitest";
import { tribute } from "./tribute";

describe("tribute data", () => {
  it("has enough virtues for the rapid leadership storm", () => {
    expect(tribute.virtueWords.length).toBeGreaterThanOrEqual(40);
  });

  it("uses the provided local photo set", () => {
    expect(tribute.heroImage).toContain("L+S");
    expect(tribute.galleryImages).toHaveLength(3);
  });
});
