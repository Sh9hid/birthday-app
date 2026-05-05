import { describe, expect, it } from "vitest";
import { tribute } from "./tribute";

describe("tribute data", () => {
  it("uses the local photo set", () => {
    expect(tribute.heroImage).toContain("L+S");
    expect(tribute.galleryImages).toHaveLength(3);
  });

  it("has a name", () => {
    expect(tribute.script.name).toBe("Nitin");
  });
});
