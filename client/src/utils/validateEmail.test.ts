import { describe, it, expect } from "vitest";
import { isValidEmail } from "./validateEmail";

describe("isValidEmail", () => {
  it("returns true for a valid email", () => {
    expect(isValidEmail("admin@deskline.com")).toBe(true);
  });

  it("returns false for an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("returns false for a string with no @ symbol", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  it("returns false for a string with no domain", () => {
    expect(isValidEmail("admin@")).toBe(false);
  });
});