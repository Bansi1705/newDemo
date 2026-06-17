import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { DropDown } from "./DropDown";

describe("DropDown Component", () => {
  const defaultProps = {
    selectValue: "",
    selectName: "country",
    optionsLabel: ["India", "USA", "Canada"],
    selectClasName: "dropdown-class",
    dropDownChange: vi.fn(),
    placeholder: "Select Country",
    label: "Country",
  };

  test("renders dropdown with label", () => {
    render(<DropDown {...defaultProps} />);

    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("renders all options", () => {
    render(<DropDown {...defaultProps} />);

    expect(screen.getByRole("option", { name: "India" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "USA" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Canada" })).toBeInTheDocument();
  });

  test("calls dropDownChange on selection change", () => {
    const mockChange = vi.fn();

    render(<DropDown {...defaultProps} dropDownChange={mockChange} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "India" },
    });

    expect(mockChange).toHaveBeenCalledTimes(1);
  });

  test("renders required mark when required is true", () => {
    render(<DropDown {...defaultProps} required={true} />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
