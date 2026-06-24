import { fireEvent, render, screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import CustomDateRangePicker from "./CustomDateRangePicker";
import { format } from "date-fns";

vi.mock("react-date-range", () => ({
  DateRangePicker: ({ onChange, ranges }: any) => (
    <div>
      <button
        data-testid="mock-date-change"
        onClick={() =>
          onChange({
            selection: {
              startDate: new Date("2025-01-15"),
              endDate: new Date("2025-01-25"),
              key: "selection",
            },
          })
        }
      >
        Change Date
      </button>
      <div data-testid="current-range">
        {ranges[0]?.startDate && ranges[0]?.endDate
          ? `${format(ranges[0].startDate, "dd/MM/yyyy")} - ${format(ranges[0].endDate, "dd/MM/yyyy")}`
          : "No date"}
      </div>
    </div>
  ),
}));

describe("CustomDateRangePicker Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<CustomDateRangePicker />);
  });
  test("Date Range Picker Opens When On click in input", () => {
    fireEvent.click(screen.getByPlaceholderText(/select date range/i));
    expect(screen.getByText("Apply")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("Cancle button cliked", () => {
    fireEvent.click(screen.getByPlaceholderText(/select date range/i));
    expect(screen.getByText("Apply")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByText("Apply")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });

  test("Date range updates after Apply is clicked", () => {
    fireEvent.click(screen.getByPlaceholderText(/select date range/i));
    fireEvent.click(screen.getByTestId("mock-date-change"));
    fireEvent.click(screen.getByText("Apply"));

    expect(
      screen.getByDisplayValue("15/01/2025 - 25/01/2025"),
    ).toBeInTheDocument();

    expect(screen.queryByText("Apply")).not.toBeInTheDocument();
  });
});
