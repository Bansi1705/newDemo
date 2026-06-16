import { render, screen } from "@testing-library/react";
import { describe, test, vi } from "vitest";
import MultipleMonthPicker from "./MultipleMonthPicker";

describe("Multiple Month Picker Component", () => {
  test("Multiple Month Picker Renders", () => {
    render(
      <MultipleMonthPicker
        selectedMultipleMonths={[null, null]}
        setSelectedMultipleMonths={vi.fn()}
      />,
    );

    expect(
      screen.getByPlaceholderText("Select Multiple Months"),
    ).toBeInTheDocument();
  });

  test("display Selected month range", () => {
    render(
      <MultipleMonthPicker
        selectedMultipleMonths={[
          new Date("2026-01-01"),
          new Date("2026-06-01"),
        ]}
        setSelectedMultipleMonths={vi.fn()}
      />,
    );

    const input = screen.getByDisplayValue("01/01/2026 - 06/30/2026");

    expect(input).toBeInTheDocument();
  });
});
