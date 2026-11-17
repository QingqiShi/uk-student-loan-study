import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

function ThemeProbe() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => {
        setTheme("light");
      }}
    >
      {theme}
    </button>
  );
}

function renderProbe() {
  render(
    <ThemeProvider>
      <ThemeProbe />
    </ThemeProvider>,
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("reads and saves the theme in localStorage", async () => {
    localStorage.setItem("theme", "dark");
    renderProbe();
    expect(screen.getByRole("button").textContent).toBe("dark");

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("renders and switches theme when the browser blocks storage", async () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("The operation is insecure.", "SecurityError");
    });

    renderProbe();
    expect(screen.getByRole("button").textContent).toBe("system");

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });
});
