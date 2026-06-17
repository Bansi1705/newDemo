import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { MultipleWeekPicker } from "./MultiWeekSelect";

vi.mock("react-datepicker", () => ({
  default: ({
    onChange,
    placeholderText,
    value,
  }: {
    onChange: (date: Date) => void;
    placeholderText: string;
    value: string;
  }) => (
    <div>
      <input
        data-testid="week-picker"
        placeholder={placeholderText}
        value={value}
        readOnly
      />

      <button
        data-testid="select-week"
        onClick={() => onChange(new Date("2025-06-18"))}
      >
        Select Week
      </button>
    </div>
  ),
}));

describe("MultipleWeekSelect test file", () => {
  test("Multiple Week Select renders", () => {
    render(
      <MultipleWeekPicker selectedWeeks={[new Date()]} onChange={vi.fn()} />,
    );
    expect(
      screen.getByPlaceholderText("Select Multiple Weeks"),
    ).toBeInTheDocument();
  });

  test("onChange called when week selected", () => {
    const mockOnChange = vi.fn();

    render(<MultipleWeekPicker selectedWeeks={[]} onChange={mockOnChange} />);
    fireEvent.click(screen.getByTestId("select-week"));
    expect(mockOnChange).toHaveBeenCalled();
  });

  test("displays correct week range", () => {
    render(
      <MultipleWeekPicker
        selectedWeeks={[
          new Date("2025-06-15"),
          new Date("2026-06-17")
        ]}
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByDisplayValue(
        "15/06/2025 - 20/06/2026",
      ),
    ).toBeInTheDocument();
  });
});
