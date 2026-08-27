import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { trackQuizBackClicked } from "@/lib/analytics";
import { QuizContainer } from "./QuizContainer";

vi.mock("@/lib/analytics", () => ({
  trackQuizStarted: vi.fn(),
  trackQuizRegionSelected: vi.fn(),
  trackQuizYearSelected: vi.fn(),
  trackQuizBackClicked: vi.fn(),
  trackQuizCompleted: vi.fn(),
}));

describe("QuizContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reports the step name the user went back from", async () => {
    const user = userEvent.setup();

    render(<QuizContainer />);

    await user.click(screen.getByRole("radio", { name: "England" }));
    await user.click(screen.getByRole("button", { name: "Go back" }));

    expect(trackQuizBackClicked).toHaveBeenCalledWith("start-year");
    expect(
      screen.getByRole("heading", { name: "Where did you study?" }),
    ).not.toBeNull();
  });
});
