import { render, screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import SingleMonthPicker from "./SingleMonthSelect";

describe("Single Month Picker Component", () => {
  test("Single Month Picker Renders", () => {
    render(
      <SingleMonthPicker
        selectSingleMonth={null}
        setSelectSingleMonth={vi.fn()}
      />,
    );
    expect(screen.getByPlaceholderText("Select Month")).toBeInTheDocument();
  });

  test("displays selected month", () => {
    const setSelectSingleMonth = vi.fn();

    render(
      <SingleMonthPicker
        selectSingleMonth={new Date("2025-06-01")}
        setSelectSingleMonth={setSelectSingleMonth}
      />,
    );

    const input = screen.getByDisplayValue("06/01/2025");
    expect(input).toBeInTheDocument();
  });
});
