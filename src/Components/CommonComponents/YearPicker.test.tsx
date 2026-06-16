import { render, screen } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";
import YearPicker from "./YearPicker";

describe("YearPicker Component", () => {
  test("renders placeholder when no year is selected", () => {

    render(
      <YearPicker
        selectedYear={null}
        setSelectedYear={vi.fn()}
      />,
    );

    expect(
      screen.getByPlaceholderText("Select Year"),
    ).toBeInTheDocument();
  });

  test("displays selected year", () => {

    render(
      <YearPicker
        selectedYear={new Date("2024-01-01")}
        setSelectedYear={vi.fn()}
      />,
    );

    expect(
      screen.getByDisplayValue("2024"),
    ).toBeInTheDocument();
  });

});