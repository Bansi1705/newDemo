import { render, screen } from "@testing-library/react";
import { describe } from "vitest";
import WeekPicker from "./WeekPicker";
import { getWeek } from "date-fns";

describe("Week Picker Component", () => {
  test("Week Picker Renders", () => {
    render(<WeekPicker />);

    expect(screen.getByRole("combobox"));
  });

  test("show current week as default value", () => {
    render(<WeekPicker />);

    const currentYear = new Date().getFullYear();
    const currentWeek = getWeek(new Date());

    const select = screen.getByRole("combobox") as HTMLSelectElement;

    expect(select.value).toBe(`week-${currentWeek} of ${currentYear}`);
  });

  test("renders weeks for custom date range", () => {
    render(
      <WeekPicker
        startYear={2024}
        startMonth={0}
        endYear={2024}
        endMonth={1}
      />,
    );

    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
  });
});
