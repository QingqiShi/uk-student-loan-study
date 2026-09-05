import { describe, it, expect, beforeEach } from "vitest";

describe("test environment web storage", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("round-trips a value through localStorage", () => {
    localStorage.setItem("key", "value");

    expect(localStorage.getItem("key")).toBe("value");
  });

  it("empties localStorage on clear", () => {
    localStorage.setItem("key", "value");

    localStorage.clear();

    expect(localStorage.getItem("key")).toBeNull();
  });

  it("round-trips a value through sessionStorage", () => {
    sessionStorage.setItem("key", "value");

    expect(sessionStorage.getItem("key")).toBe("value");
  });

  it("empties sessionStorage on clear", () => {
    sessionStorage.setItem("key", "value");

    sessionStorage.clear();

    expect(sessionStorage.getItem("key")).toBeNull();
  });
});
