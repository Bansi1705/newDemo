import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import InputField from "./InputFeild";

const handleInputFieldChnage = vi.fn();

const renderInputField = () =>
  render(
    <InputField
      type="text"
      id="name"
      name="name"
      value=""
      onChange={handleInputFieldChnage}
      label="User Name"
      placeholder="Enter name"
      error="Name is required"
      required={true}
    />,
  );

describe("InputField Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    renderInputField();
  });
  test("renders input field", () => {
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    expect(screen.getByText("User Name")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  test("calls onChange when input value changes", () => {
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Radha" },
    });
    expect(handleInputFieldChnage).toHaveBeenCalled();
  });
});
