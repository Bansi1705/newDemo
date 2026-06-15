import { render, screen } from "@testing-library/react";
import { ReactDatePicker } from "./DatePicker";

describe("ReactDatePicker", () => {
  test("renders date picker", () => {
    render(<ReactDatePicker placeholder="Any Placeholder" />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("renders error message", () => {
    render(<ReactDatePicker error="Date is required" />);

    expect(screen.getByText("Date is required")).toBeInTheDocument();
  });
});
