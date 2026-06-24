import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Buttons } from "./Buttons";

const handleClick = vi.fn();

const renderButtonElement = () =>
  render(
    <Buttons
      label="Submit"
      dataTestid="submit-btn"
      type="submit"
      onClick={handleClick}
    />,
  );

describe("Buttons Component", () => {
  test("renders button with label and onclick handleClick called", () => {
    renderButtonElement();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("button disabled when disabled prop is true", () => {
    render(<Buttons label="Delete" disabled dataTestid="delete-btn" />);
    expect(screen.getByTestId("delete-btn")).toBeDisabled();
  });
});
