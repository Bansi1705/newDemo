import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { MultipleWeekPicker } from "./MultiWeekSelect";

describe("MultipleWeekSelect test file", () => {
  test("displays correct week range", () => {
    render(
      <MultipleWeekPicker
        selectedWeeks={[new Date("2025-06-15"), new Date("2026-06-17")]}
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByDisplayValue("15/06/2025 - 20/06/2026"),
    ).toBeInTheDocument();
  });
});
